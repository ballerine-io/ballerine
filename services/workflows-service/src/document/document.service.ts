import { ajv } from '@/common/ajv/ajv.validator';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';
import { formatValueDestination } from '@/common/ui-definition-parse-utils/format-value-destination';
import { getFieldDefinitionsFromSchema } from '@/common/ui-definition-parse-utils/get-field-definitions-from-ui-schema';
import {
  IFormElement,
  IUIDefinitionPage,
  TDeepthLevelStack,
} from '@/common/ui-definition-parse-utils/types';
import { DocumentFileService } from '@/document-file/document-file.service';
import { CreateDocumentFileSchema } from '@/document-file/dtos/document-file.dto';
import { ValidationError } from '@/errors';
import { FileService } from '@/providers/file/file.service';
import { StorageService } from '@/storage/storage.service';
import { PrismaTransactionClient, TProjectId } from '@/types';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { addPropertiesSchemaToDocument } from '@/workflow/utils/add-properties-schema-to-document';
import { WorkflowService } from '@/workflow/workflow.service';
import {
  AnyRecord,
  CollectionFlowStatusesEnum,
  CommonWorkflowEvent,
  getDocumentId,
  setCollectionFlowStatus,
} from '@ballerine/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Document,
  DocumentFile,
  DocumentStatus,
  File,
  Prisma,
  WorkflowDefinition,
  WorkflowRuntimeData,
} from '@prisma/client';
import { Static } from '@sinclair/typebox';
import { get } from 'lodash';
import * as z from 'zod';
import { DocumentRepository } from './document.repository';
import { CreateDocumentSchema, UpdateDocumentSchema } from './dtos/document.dto';
import { addRequestedDocumentToBusinessEntityDocuments } from './helpers/add-requested-document-to-business-entity-documents';
import { addRequestedDocumentToIndividualDocuments } from './helpers/add-requested-document-to-individuals-documents';
import { parseDocumentDefinition } from './helpers/parse-document-definition';
import {
  DocumentTrackerDocumentSchema,
  DocumentTrackerResponseSchema,
  EntitySchema,
  TParsedDocuments,
} from './types';

@Injectable()
export class DocumentService {
  constructor(
    protected readonly repository: DocumentRepository,
    protected readonly documentFileService: DocumentFileService,
    protected readonly fileService: FileService,
    protected readonly workflowService: WorkflowService,
    protected readonly storageService: StorageService,
    protected readonly uiDefinitionService: UiDefinitionService,
    protected readonly workflowDefinitionService: WorkflowDefinitionService,
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

    const entityId = this.getEntityId(data);

    const uploadedFile = await this.fileService.uploadNewFile(projectId, entityId, {
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

    return await this.getByEntityIdAndWorkflowId(entityId, data.workflowRuntimeDataId, [projectId]);
  }

  async getDocumentsByIds(documentIds: string[], projectId: TProjectId) {
    return await this.repository.findMany([projectId], {
      where: {
        id: { in: documentIds },
      },
    });
  }

  async getByEntityIdAndWorkflowId(
    entityId: string,
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    args?: Omit<Prisma.DocumentFindManyArgs, 'where'>,
    transaction?: PrismaTransactionClient,
  ) {
    const documents = await this.repository.findByEntityIdAndWorkflowIdWithFiles(
      entityId,
      workflowRuntimeDataId,
      projectIds,
      args,
      transaction,
    );

    const workflowDefinition = await this.workflowDefinitionService.getByWorkflowRuntimeDataId(
      workflowRuntimeDataId,
      projectIds,
    );

    if (!workflowDefinition) {
      throw new BadRequestException(
        `Workflow definition for a workflow with an id of "${workflowRuntimeDataId}" not found`,
      );
    }

    return this.formatDocuments({
      documents,
      documentSchema: workflowDefinition.documentsSchema,
    });
  }

  async updateByIdWithFile(
    {
      file,
      metadata,
      projectId,
      ...data
    }: Static<typeof UpdateDocumentSchema> & {
      documentId: string;
      file: Express.Multer.File;
      metadata: Omit<
        Static<typeof CreateDocumentFileSchema>,
        'documentId' | 'fileId' | 'projectId'
      >;
      projectId: string;
    },
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

    const { documentId, ...documentData } = data;

    const entityId = this.getEntityId(data);

    const uploadedFile = await this.fileService.uploadNewFile(projectId, entityId, {
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

    await this.documentFileService.create(
      {
        documentId: documentId,
        fileId: uploadedFile.id,
        projectId,
        ...metadata,
      },
      undefined,
      transaction,
    );

    const workflowDefinition = await this.workflowDefinitionService.getByWorkflowRuntimeDataId(
      data.workflowRuntimeDataId,
      [projectId],
    );
    await this.repository.updateById(data.documentId, [projectId], {
      ...documentData,
      ...(documentData.businessId && { businessId: documentData.businessId }),
      ...(documentData.endUserId && { endUserId: documentData.endUserId }),
    });

    if (!workflowDefinition) {
      throw new BadRequestException(
        `Workflow definition for a workflow with an id of "${data.workflowRuntimeDataId}" not found`,
      );
    }

    return await this.getByEntityIdAndWorkflowId(entityId, data.workflowRuntimeDataId, [projectId]);
  }

  async updateById(
    id: string,
    projectIds: TProjectId[],
    data: Prisma.DocumentUpdateInput,
    args?: Prisma.DocumentUpdateManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    await this.repository.updateById(id, projectIds, data, args, transaction);

    const documents = await this.repository.findManyWithFiles(projectIds);

    return this.formatDocuments({
      documents,
      // Would have to have a separate workflow definition for each document
      documentSchema: null,
    });
  }

  async updateDocumentDecisionById(
    id: string,
    projectIds: TProjectId[],
    data: {
      decision: 'approve' | 'reject' | 'revision' | null;
    } & Pick<Prisma.DocumentUpdateInput, 'decisionReason' | 'comment'>,
    args?: Prisma.DocumentUpdateManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    const document = await this.repository.findById(id, projectIds);

    if (!document) {
      throw new BadRequestException(`Document with an id of "${id}" was not found`);
    }

    if (!document.workflowRuntimeDataId) {
      throw new BadRequestException(`Attempted to update decision for a document with no workflow`);
    }

    const workflowDefinition = await this.workflowDefinitionService.getByWorkflowRuntimeDataId(
      document.workflowRuntimeDataId,
      projectIds,
    );

    if (!workflowDefinition) {
      throw new BadRequestException(
        `Workflow definition for a workflow with an id of "${document.workflowRuntimeDataId}" was not found`,
      );
    }

    const documentWithPropertiesSchema = addPropertiesSchemaToDocument(
      // @ts-expect-error -- the function expects properties not used by the function.
      {
        ...document,
        issuer: {
          country: document.issuingCountry,
        },
      },
      workflowDefinition.documentsSchema,
    );
    const propertiesSchema = documentWithPropertiesSchema.propertiesSchema ?? {};
    const shouldValidateDocument =
      data.decision === 'approve' && Object.keys(propertiesSchema)?.length;

    if (shouldValidateDocument) {
      const validatePropertiesSchema = ajv.compile(propertiesSchema);
      const isValidPropertiesSchema = validatePropertiesSchema(
        documentWithPropertiesSchema?.properties,
      );

      if (!isValidPropertiesSchema) {
        throw ValidationError.fromAjvError(validatePropertiesSchema.errors ?? []);
      }
    }

    const Status = {
      approve: 'approved',
      reject: 'rejected',
      revision: 'revisions',
    } as const;

    const decision = data.decision ? Status[data.decision] : null;

    await this.repository.updateById(
      id,
      projectIds,
      {
        ...data,
        decision,
      },
      args,
      transaction,
    );

    const documents = await this.repository.findManyWithFiles(projectIds);

    return this.formatDocuments({
      documents,
      documentSchema: workflowDefinition.documentsSchema,
    });
  }

  async deleteByIds(
    ids: string[],
    projectIds: TProjectId[],
    args?: Prisma.DocumentDeleteManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    await this.repository.deleteByIds(ids, projectIds, args, transaction);

    const documents = await this.repository.findManyWithFiles(projectIds);

    return this.formatDocuments({
      documents,
      // Would have to have a separate workflow definition for each document
      documentSchema: null,
    });
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
              imageUrl: uploadedFile.signedUrl,
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

    const workflowEntityId = workflowRuntimeData.endUserId || workflowRuntimeData.businessId;

    if (!workflowEntityId) {
      throw new BadRequestException('Workflow does not have an end user or business id');
    }

    const uploadedFile = await this.fileService.uploadNewFile(projectIds[0], workflowEntityId, {
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

    const documents = await this.repository.findManyWithFiles(projectIds);

    const workflowDefinition = await this.workflowDefinitionService.getByWorkflowRuntimeDataId(
      workflowRuntimeDataId,
      projectIds,
    );

    if (!workflowDefinition) {
      throw new BadRequestException(
        `Workflow definition for a workflow with an id of "${workflowRuntimeDataId}" not found`,
      );
    }

    return this.formatDocuments({
      documents,
      documentSchema: workflowDefinition.documentsSchema,
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

    const parsedUIDocuments = this.parseDocumentsFromUISchema(
      uiSchema.elements as IUIDefinitionPage[],
      workflowData.context,
    );

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

    const generateDocumentTrackerItem = <TEntity extends z.infer<typeof EntitySchema>>(
      matchingDocument: Document | undefined,
      expectedDoc: TParsedDocuments['business'][number],
      entity: TEntity,
    ) =>
      ({
        documentId: matchingDocument?.id ?? null,
        status: matchingDocument?.status ?? 'unprovided',
        decision: matchingDocument?.decision ?? null,
        identifiers: {
          document: expectedDoc,
          entity,
        },
      } satisfies z.output<typeof DocumentTrackerDocumentSchema>);

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
        ubos: parsedUIDocuments.individuals.ubos.map(parsedDocument => {
          const { ballerineEntityId } = parsedDocument;
          const ubo = entitiesWithDocuments.ubos.find(ubo => ubo.id === ballerineEntityId);

          if (!ubo) {
            throw new Error('Ubo not found');
          }

          const matchingDocument = ubo.documents.find(doc =>
            isMatchingDocument(doc, parsedDocument),
          );

          return generateDocumentTrackerItem(matchingDocument, parsedDocument, {
            id: ubo.id,
            firstName: ubo.firstName,
            lastName: ubo.lastName,
            entityType: 'ubo',
          });
        }),
        directors: parsedUIDocuments.individuals.directors.map(parsedDocument => {
          const { ballerineEntityId } = parsedDocument;
          const director = entitiesWithDocuments.directors.find(
            director => director.id === ballerineEntityId,
          );

          if (!director) {
            throw new Error('Director not found');
          }

          const matchingDocument = director.documents.find(doc =>
            isMatchingDocument(doc, parsedDocument),
          );

          return generateDocumentTrackerItem(matchingDocument, parsedDocument, {
            id: director.id,
            firstName: director.firstName,
            lastName: director.lastName,
            entityType: 'director',
          });
        }),
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
      entityType: document.entity.type,
    }));

    const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(
      workflowId,
      {
        select: {
          workflowDefinition: true,
          context: true,
        },
      },
      [projectId],
    );

    const uiDefinition = await this.uiDefinitionService.getByWorkflowDefinitionId(
      workflowRuntimeData.workflowDefinitionId,
      'collection_flow',
      [projectId],
    );

    const createdDocuments = await Promise.all(
      documentsToCreate.map(async ({ entityType, ...doc }) => {
        const createdDocument = await this.repository.create(doc);

        return {
          ...createdDocument,
          entityType,
          entityId: entityType === 'business' ? undefined : createdDocument.endUserId,
        };
      }),
    );

    const contextWithDocuments = createdDocuments.reduce((context, document) => {
      const createdDocument = document;

      if (!createdDocument) {
        return context;
      }

      const documentToInsert = {
        id: createdDocument.id,
        status: DocumentStatus.requested,
        decision: null,
        version: createdDocument.version.toString(),
        type: createdDocument.type,
        category: createdDocument.category,
        issuingCountry: createdDocument.issuingCountry,
        issuingVersion: createdDocument.issuingVersion,
        entityId: createdDocument.entityId as string | undefined,
      };

      return document.entityType === 'business'
        ? addRequestedDocumentToBusinessEntityDocuments(
            context,
            document.entityType as 'business' | 'ubo' | 'director',
            uiDefinition,
            documentToInsert,
          )
        : addRequestedDocumentToIndividualDocuments(
            context,
            document.entityType as 'ubo' | 'director',
            uiDefinition,
            documentToInsert,
          );
    }, workflowRuntimeData.context);

    const contextWithRevision = setCollectionFlowStatus(
      contextWithDocuments,
      CollectionFlowStatusesEnum.revision,
    );

    await this.workflowService.updateWorkflowRuntimeData(
      workflowId,
      {
        context: contextWithRevision,
      },
      projectId,
    );

    await this.workflowService.event(
      {
        id: workflowId,
        name: CommonWorkflowEvent.REVISION,
        payload: {},
      },
      [projectId],
      projectId,
    );

    return { message: 'Documents requested successfully', count: createdDocuments.length };
  }

  private parseDocumentsFromUISchema(
    uiSchema: IUIDefinitionPage[],
    context: AnyRecord,
  ): TParsedDocuments {
    const result: TParsedDocuments = {
      business: [],
      individuals: {
        ubos: [],
        directors: [],
      },
    };

    uiSchema.forEach(page => {
      // Extracting only field element definitions from the page
      const fieldElements = getFieldDefinitionsFromSchema(page.elements);

      const run = (
        elements: Array<IFormElement<any>>,
        stack: TDeepthLevelStack,
        {
          ballerineEntityId,
          entityType,
        }: { entityType?: 'ubo' | 'director' | 'business'; ballerineEntityId?: string },
      ) => {
        for (const element of elements) {
          // Extracting revision reason fro documents isnt common so we handling it explicitly
          if (element.element === 'documentfield') {
            const parsedDocument = parseDocumentDefinition(element);

            if (!parsedDocument) {
              continue;
            }

            if (!entityType) {
              result.business.push(parsedDocument);
              continue;
            }

            if (!ballerineEntityId) {
              throw new Error('Ballerine entity id is missing on');
            }

            if (entityType === 'ubo') {
              result.individuals.ubos.push({
                ...parsedDocument,
                entityType,
                ballerineEntityId,
              });
            }

            if (entityType === 'director') {
              result.individuals.directors.push({
                ...parsedDocument,
                entityType,
                ballerineEntityId,
              });
            }
          }

          if (element.element === 'entityfieldgroup') {
            const entityType = element.params.type;

            const value = get(
              context,
              formatValueDestination(element.valueDestination, stack),
              [],
            ) as Array<{ ballerineEntityId: string }>;

            if (!value) {
              continue;
            }

            if (Array.isArray(element.children) && element.children.length > 0) {
              value?.forEach((entity: { ballerineEntityId: string }, index: number) => {
                run(element.children as Array<IFormElement<any>>, [...stack, index], {
                  entityType,
                  ballerineEntityId: entity.ballerineEntityId,
                });
              });
            }
          }
        }
      };

      run(fieldElements, [], {});
    });

    return result;
  }

  private getEntityId(data: { businessId?: string; endUserId?: string }) {
    if (data.businessId) {
      return data.businessId;
    }

    if (data.endUserId) {
      return data.endUserId;
    }

    throw new BadRequestException('Business or end user id is required');
  }

  async formatDocuments({
    documents,
    documentSchema,
  }: {
    documents: Array<Document & { files: DocumentFile[] }>;
    documentSchema: WorkflowDefinition['documentsSchema'];
  }) {
    const documentsWithFiles = await this.fetchDocumentsFiles({
      documents,
      format: 'signed-url',
    });
    const typedDocuments = documentsWithFiles as Array<
      Omit<(typeof documentsWithFiles)[number], 'files'> & {
        files: Array<(typeof documentsWithFiles)[number]['files'][number] & { file: File }>;
      }
    >;

    return typedDocuments.map(({ files, ...document }) => {
      const documentWithPropertiesSchema = addPropertiesSchemaToDocument(
        // @ts-expect-error -- the function expects properties not used by the function.
        {
          ...document,
          issuer: {
            country: document.issuingCountry,
          },
        },
        documentSchema,
      );

      return {
        ...document,
        files: files.map(({ file, ...fileData }) => ({
          ...fileData,
          fileName: file.fileName,
        })),
        propertiesSchema: documentWithPropertiesSchema.propertiesSchema,
      };
    });
  }
}
