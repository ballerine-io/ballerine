import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentRepository } from './document.repository';
import {
  Document,
  DocumentFile,
  DocumentStatus,
  Prisma,
  WorkflowRuntimeData,
} from '@prisma/client';
import { PrismaTransactionClient, TProjectId } from '@/types';
import { DocumentFileService } from '@/document-file/document-file.service';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';
import { Static } from '@sinclair/typebox';
import { CreateDocumentSchema } from './dtos/document.dto';
import { CreateDocumentFileSchema } from '@/document-file/dtos/document-file.dto';
import { WorkflowService } from '@/workflow/workflow.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { isType, getDocumentId } from '@ballerine/common';
import z from 'zod';
import { TParsedDocuments, EntitySchema, DocumentTrackerResponseSchema } from './types';

@Injectable()
export class DocumentService {
  constructor(
    protected readonly repository: DocumentRepository,
    protected readonly documentFileService: DocumentFileService,
    protected readonly fileService: FileService,
    protected readonly workflowService: WorkflowService,
    protected readonly storageService: StorageService,
    protected readonly uiDefinitionService: UiDefinitionService,
  ) {}

  async create(
    {
      file,
      metadata,
      projectId,
      ...data
    }: Static<typeof CreateDocumentSchema> & {
      file: Express.Multer.File;
      metadata: Omit<
        Static<typeof CreateDocumentFileSchema>,
        'documentId' | 'fileId' | 'projectId'
      >;
      projectId: string;
    },
    args?: Prisma.DocumentCreateArgs,
    transaction?: PrismaTransactionClient,
  ) {
    if (!data.businessId && !data.endUserId) {
      throw new BadRequestException('Business or end user id is required');
    }

    if (data.businessId && data.endUserId) {
      throw new BadRequestException('Business and end user id cannot be set at the same time');
    }

    if (!data.workflowRuntimeDataId) {
      throw new BadRequestException('Workflow runtime data id is required');
    }

    const getEntityId = () => {
      if (data.businessId) {
        return data.businessId;
      }

      if (data.endUserId) {
        return data.endUserId;
      }

      throw new BadRequestException('Business or end user id is required');
    };

    const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(
      data.workflowRuntimeDataId,
      {},
      [projectId],
    );

    const uploadedFile = await this.fileService.uploadNewFile(projectId, workflowRuntimeData, {
      ...file,
      mimetype:
        file.mimetype ||
        (
          await getFileMetadata({
            file: file.originalname || '',
            fileName: file.originalname || '',
          })
        )?.mimeType ||
        '',
    });
    const document = await this.repository.create(
      {
        ...data,
        ...(data.businessId && { businessId: data.businessId }),
        ...(data.endUserId && { endUserId: data.endUserId }),
        projectId,
      },
      args,
      transaction,
    );

    await this.documentFileService.create(
      {
        documentId: document.id,
        fileId: uploadedFile.id,
        projectId,
        ...metadata,
      },
      undefined,
      transaction,
    );

    const entityId = getEntityId();

    return await this.getByEntityIdAndWorkflowId(entityId, data.workflowRuntimeDataId, [projectId]);
  }

  async getByEntityIdAndWorkflowId(
    entityId: string,
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    args?: Omit<Prisma.DocumentFindManyArgs, 'where'>,
    transaction?: PrismaTransactionClient,
  ) {
    const documents = await this.repository.findByEntityIdAndWorkflowId(
      entityId,
      workflowRuntimeDataId,
      projectIds,
      {
        ...args,
        include: {
          ...args?.include,
          files: true,
        },
      },
      transaction,
    );
    const documentsWithFiles = await this.fetchDocumentsFiles({
      documents: documents as Array<Document & { files: DocumentFile[] }>,
      format: 'signed-url',
    });

    return documentsWithFiles;
  }

  async updateById(
    id: string,
    projectIds: TProjectId[],
    data: Prisma.DocumentUpdateInput,
    args?: Prisma.DocumentUpdateManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    await this.repository.updateById(id, projectIds, data, args, transaction);

    const documents = await this.repository.findMany(
      projectIds,
      {
        include: {
          files: true,
        },
      },
      transaction,
    );
    const documentsWithFiles = await this.fetchDocumentsFiles({
      documents: documents as Array<Document & { files: DocumentFile[] }>,
      format: 'signed-url',
    });

    return documentsWithFiles;
  }

  async deleteByIds(
    ids: string[],
    projectIds: TProjectId[],
    args?: Prisma.DocumentDeleteManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    await this.repository.deleteByIds(ids, projectIds, args, transaction);

    const documents = await this.repository.findMany(
      projectIds,
      {
        include: {
          files: true,
        },
      },
      transaction,
    );
    const documentsWithFiles = await this.fetchDocumentsFiles({
      documents: documents as Array<Document & { files: DocumentFile[] }>,
      format: 'signed-url',
    });

    return documentsWithFiles;
  }

  async fetchDocumentsFiles({
    documents,
    format,
  }: {
    documents: Array<Document & { files: DocumentFile[] }>;
    format: Parameters<StorageService['fetchFileContent']>[0]['format'];
  }) {
    return await Promise.all(
      documents?.map(async document => {
        const files = await Promise.all(
          document.files?.map(async file => {
            const uploadedFile = await this.storageService.fetchFileContent({
              id: file.fileId,
              projectIds: [document.projectId],
              format,
            });

            return {
              ...file,
              mimeType: uploadedFile.mimeType,
              signedUrl: uploadedFile.signedUrl,
            };
          }) ?? [],
        );

        return {
          ...document,
          files,
        };
      }) ?? [],
    );
  }
  async reuploadDocumentFileById(
    fileId: string,
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    file: Express.Multer.File,
  ) {
    if (!projectIds[0]) {
      throw new BadRequestException('Project id is required');
    }

    const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(
      workflowRuntimeDataId,
      {},
      projectIds,
    );
    const uploadedFile = await this.fileService.uploadNewFile(projectIds[0], workflowRuntimeData, {
      ...file,
      mimetype:
        file.mimetype ||
        (
          await getFileMetadata({
            file: file.originalname || '',
            fileName: file.originalname || '',
          })
        )?.mimeType ||
        '',
    });

    await this.documentFileService.updateById(fileId, {
      file: {
        connect: { id: uploadedFile.id },
      },
    });

    const documents = await this.repository.findMany(projectIds, {
      include: {
        files: true,
      },
    });

    return await this.fetchDocumentsFiles({
      documents: documents as Array<Document & { files: DocumentFile[] }>,
      format: 'signed-url',
    });
  }

  async getDocumentTrackerByWorkflowId(projectId: TProjectId, workflowId: string) {
    const uiDefinition = await this.uiDefinitionService.getByRuntimeId(
      workflowId,
      'collection_flow',
      [projectId],
    );

    const uiSchemaValidation = z
      .object({ elements: z.array(z.record(z.string(), z.any())) })
      .safeParse(uiDefinition.uiSchema);

    if (!uiSchemaValidation.success) {
      return {
        business: [],
        individuals: {
          ubos: [],
          directors: [],
        },
      };
    }

    const uiSchema = uiSchemaValidation.data;

    const parsedUIDocuments = this.parseDocumentsFromUISchema(uiSchema.elements);

    const workflowData = (await this.workflowService.getWorkflowRuntimeDataById(
      workflowId,
      {
        select: {
          context: true,
          childWorkflowsRuntimeData: true,
        },
      },
      [projectId],
    )) as WorkflowRuntimeData & {
      childWorkflowsRuntimeData: WorkflowRuntimeData[];
    };

    const entities = {
      business: {
        entityType: 'business',
        id: workflowData.context.entity.ballerineEntityId,
        companyName: workflowData.context.entity.data.companyName,
      },
      directors: (
        (workflowData.context.entity.data.additionalInfo.directors ?? []) as Array<{
          ballerineEntityId: string;
          firstName: string;
          lastName: string;
        }>
      ).map(director => ({
        entityType: 'director',
        id: director.ballerineEntityId,
        firstName: director.firstName,
        lastName: director.lastName,
      })),
      ubos: workflowData.childWorkflowsRuntimeData.map(childWorkflow => ({
        entityType: 'ubo',
        id: childWorkflow.endUserId ?? '',
        firstName: childWorkflow.context.entity.data.firstName,
        lastName: childWorkflow.context.entity.data.lastName,
      })),
    } as const satisfies {
      business: z.infer<typeof EntitySchema>;
      directors: Array<z.infer<typeof EntitySchema>>;
      ubos: Array<z.infer<typeof EntitySchema>>;
    };

    const allDocuments = await this.repository.findMany([projectId], {
      where: {
        workflowRuntimeDataId: workflowId,
      },
    });

    const entitiesWithDocuments = {
      business: {
        ...entities.business,
        documents: allDocuments.filter(doc => doc.businessId === entities.business.id),
      },
      ubos: entities.ubos.map(ubo => ({
        ...ubo,
        documents: allDocuments.filter(doc => doc.endUserId === ubo.id),
      })),
      directors: entities.directors.map(director => ({
        ...director,
        documents: allDocuments.filter(doc => doc.endUserId === director.id),
      })),
    };

    const isMatchingDocument = (
      doc: Document,
      expectedDoc: TParsedDocuments['business'][number],
    ): boolean => {
      const expectedDocId = getDocumentId(
        {
          type: expectedDoc.type,
          category: expectedDoc.category,
          issuer: { country: expectedDoc.issuingCountry },
          version: expectedDoc.version,
        },
        false,
      );
      const actualDocId = getDocumentId(
        {
          type: doc.type,
          category: doc.category,
          issuer: { country: doc.issuingCountry },
          version: doc.version,
        },
        false,
      );

      return expectedDocId === actualDocId;
    };

    const generateDocumentTrackerItem = <T extends z.infer<typeof EntitySchema>>(
      matchingDocument: Document | undefined,
      expectedDoc: TParsedDocuments['business'][number],
      entity: T,
    ) => ({
      documentId: matchingDocument?.id ?? null,
      status: matchingDocument?.status ?? 'unprovided',
      decision: matchingDocument?.decision ?? null,
      identifiers: {
        document: expectedDoc,
        entity,
      },
    });

    const result: z.output<typeof DocumentTrackerResponseSchema> = {
      business: parsedUIDocuments.business.map(expectedDoc => {
        const matchingDocument = entitiesWithDocuments.business.documents.find(doc =>
          isMatchingDocument(doc, expectedDoc),
        );

        return generateDocumentTrackerItem(matchingDocument, expectedDoc, {
          id: entities.business.id,
          companyName: entities.business.companyName,
          entityType: 'business',
        });
      }),
      individuals: {
        ubos: entitiesWithDocuments.ubos.flatMap(ubo =>
          parsedUIDocuments.individuals.ubos.map(expectedDoc =>
            generateDocumentTrackerItem(
              ubo.documents.find(doc => isMatchingDocument(doc, expectedDoc)),
              expectedDoc,
              {
                id: ubo.id,
                firstName: ubo.firstName,
                lastName: ubo.lastName,
                entityType: 'ubo',
              },
            ),
          ),
        ),
        directors: entitiesWithDocuments.directors.flatMap(director =>
          parsedUIDocuments.individuals.directors.map(expectedDoc =>
            generateDocumentTrackerItem(
              director.documents.find(doc => isMatchingDocument(doc, expectedDoc)),
              expectedDoc,
              {
                id: director.id,
                firstName: director.firstName,
                lastName: director.lastName,
                entityType: 'director',
              },
            ),
          ),
        ),
      },
    };

    return result;
  }

  async requestDocumentsByIds(
    projectId: TProjectId,
    workflowId: string,
    documents: Array<{
      type: string;
      category: string;
      decisionReason?: string;
      issuingCountry: string;
      issuingVersion: string;
      version: string;
      entity: {
        id: string;
        type: 'business' | 'ubo' | 'director';
      };
    }>,
  ) {
    const documentsToCreate = documents.map(document => ({
      category: document.category,
      type: document.type,
      decisionReason: document.decisionReason,
      issuingVersion: document.issuingVersion,
      issuingCountry: document.issuingCountry,
      version: parseInt(document.version),
      status: DocumentStatus.requested,
      properties: {},
      projectId: projectId,
      workflowRuntimeDataId: workflowId,
      businessId: document.entity.type === 'business' ? document.entity.id : undefined,
      endUserId: ['ubo', 'director'].includes(document.entity.type)
        ? document.entity.id
        : undefined,
    }));

    const createdDocuments = await this.repository.createMany(documentsToCreate);

    return { message: 'Documents requested successfully', count: createdDocuments.count };
  }

  private parseDocumentsFromUISchema(uiSchema: Array<Record<string, any>>): TParsedDocuments {
    const result: TParsedDocuments = {
      business: [],
      individuals: {
        ubos: [],
        directors: [],
      },
    };

    const processElement = (element: Record<string, any>) => {
      if (isType(z.array(z.record(z.string(), z.any())))(element?.elements)) {
        element.elements.forEach(processElement);
      }

      if (isType(z.array(z.record(z.string(), z.any())))(element?.children)) {
        element.children.forEach(processElement);
      }

      if (element.element !== 'documentfield') {
        return;
      }

      const template = element.params.template;

      const parsedDocument = z
        .object({
          type: z.string(),
          id: z.string(),
          category: z.string(),
          issuer: z.object({
            country: z.string(),
          }),
          issuingVersion: z.number(),
          version: z.string(),
          entityType: z.enum(['business', 'ubo', 'director']).default('business'),
        })
        .transform(({ entityType, type, id, category, issuer, issuingVersion, version }) => ({
          entityType,
          type,
          templateId: id,
          category,
          issuingCountry: issuer.country,
          issuingVersion: issuingVersion.toString(),
          version,
        }))
        .safeParse(template);

      if (!parsedDocument.success) {
        return;
      }

      if (!element.valueDestination) {
        return;
      }

      const isUboDocument =
        element.valueDestination.includes('.ubo') &&
        element.valueDestination.includes('.documents');
      const isDirectorDocument =
        element.valueDestination.includes('.director') &&
        element.valueDestination.includes('.documents');

      if (isUboDocument) {
        parsedDocument.data.entityType = 'ubo';
        result.individuals.ubos.push(parsedDocument.data);
      } else if (isDirectorDocument) {
        parsedDocument.data.entityType = 'director';
        result.individuals.directors.push(parsedDocument.data);
      } else {
        result.business.push(parsedDocument.data);
      }
    };

    uiSchema.forEach(processElement);

    return result;
  }
}
