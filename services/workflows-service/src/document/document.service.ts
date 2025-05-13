import { ajv } from '@/common/ajv/ajv.validator';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';
import { formatValueDestination } from '@/common/ui-definition-parse-utils/format-value-destination';
import { getFieldDefinitionsFromSchema } from '@/common/ui-definition-parse-utils/get-field-definitions-from-ui-schema';
import {
  IFormElement,
  IUIDefinitionPage,
  TDeepthLevelStack,
} from '@/common/ui-definition-parse-utils/types';
import { getEntityId } from '@/common/utils/get-entity-id/get-entity-id';
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
  DocumentDecision,
  DocumentFile,
  DocumentStatus,
  File,
  Prisma,
  WorkflowDefinition,
  WorkflowRuntimeData,
} from '@prisma/client';
import { Static } from '@sinclair/typebox';
import { get } from 'lodash';
import set from 'lodash/set';
import * as z from 'zod';
import { DocumentRepository } from './document.repository';
import { CreateDocumentSchema, UpdateDocumentSchema } from './dtos/document.dto';
import { addRequestedDocumentToBusinessEntityDocuments } from './helpers/add-requested-document-to-business-entity-documents';
import { addRequestedDocumentToIndividualDocuments } from './helpers/add-requested-document-to-individuals-documents';
import { findBusinessDocumentsInContext } from './helpers/find-business-documents-in-context';
import { findUboDocumentsInUIDefinition } from './helpers/find-ubo-documents-in-ui-definition';
import { parseDocumentDefinition } from './helpers/parse-document-definition';
import {
  DocumentTrackerDocumentSchema,
  DocumentTrackerResponseSchema,
  EntitySchema,
  TParsedDocuments,
} from './types';
import { defaultPrismaTransactionOptions } from '@/prisma/prisma.util';
import { beginTransactionIfNotExistCurry } from '@/prisma/prisma.util';
import { PrismaService } from '@/prisma/prisma.service';

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
    protected readonly prismaService: PrismaService,
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

    const entityId = getEntityId(data);

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
    const createdDocument = await this.repository.create(
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
        documentId: createdDocument.id,
        fileId: uploadedFile.id,
        projectId,
        ...metadata,
      },
      undefined,
      transaction,
    );

    const documents = await this.getByEntityIdAndWorkflowId(entityId, data.workflowRuntimeDataId, [
      projectId,
    ]);

    const createdAndFormattedDocument = documents.find(doc => createdDocument.id === doc.id);

    if (!createdAndFormattedDocument) {
      throw new BadRequestException(`Document with an id of "${createdDocument.id}" was not found`);
    }

    return createdAndFormattedDocument;
  }

  async getDocumentById(documentId: string, projectId: TProjectId) {
    const document = await this.repository.findByIdWithFiles(documentId, [projectId]);

    if (!document) {
      throw new BadRequestException(`Document with an id of "${documentId}" was not found`);
    }

    if (!document.workflowRuntimeDataId) {
      throw new BadRequestException(`Document with an id of "${documentId}" has no workflow`);
    }

    const workflowDefinition = await this.workflowDefinitionService.getByWorkflowRuntimeDataId(
      document.workflowRuntimeDataId,
      [projectId],
    );

    if (!workflowDefinition) {
      throw new BadRequestException(
        `Workflow definition for a workflow with an id of "${document.workflowRuntimeDataId}" not found`,
      );
    }

    const formattedDocuments = await this.formatDocuments({
      documents: [document],
      documentSchema: workflowDefinition.documentsSchema,
    });

    return formattedDocuments[0];
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

    const formattedDocuments = await this.formatDocuments({
      documents,
      documentSchema: workflowDefinition.documentsSchema,
    });

    return this.getLatestDocumentVersions(formattedDocuments);
  }

  async getByEntityIdsAndWorkflowId(
    entityIds: string[],
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    args?: Omit<Prisma.DocumentFindManyArgs, 'where'>,
    transaction?: PrismaTransactionClient,
  ) {
    const documents = await this.repository.findByEntityIdsAndWorkflowIdWithFiles(
      entityIds,
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

    const formattedDocuments = await this.formatDocuments({
      documents,
      documentSchema: workflowDefinition.documentsSchema,
    });

    return this.getLatestDocumentVersions(formattedDocuments);
  }

  async updateByIdWithFile(
    {
      file,
      metadata,
      projectId,
      ...data
    }: Static<typeof UpdateDocumentSchema> & {
      documentId: string;
      workflowRuntimeDataId: string;
      businessId?: string;
      endUserId?: string;
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

    const entityId = getEntityId(data);

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
    const shouldValidateDocument = data.properties && Object.keys(propertiesSchema)?.length;

    if (shouldValidateDocument) {
      const validatePropertiesSchema = ajv.compile(propertiesSchema);
      const isValidPropertiesSchema = validatePropertiesSchema(data.properties);

      if (!isValidPropertiesSchema) {
        throw ValidationError.fromAjvError(validatePropertiesSchema.errors ?? []);
      }
    }

    await this.repository.updateById(id, projectIds, data, args, transaction);

    const documents = await this.repository.findManyWithFiles(projectIds);

    return this.formatDocuments({
      documents,
      documentSchema: workflowDefinition.documentsSchema,
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
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return beginTransactionIfNotExist(async transaction => {
      const document = await this.repository.findById(id, projectIds);

      if (!document) {
        throw new BadRequestException(`Document with an id of "${id}" was not found`);
      }

      if (!document.workflowRuntimeDataId) {
        throw new BadRequestException(
          `Attempted to update decision for a document with no workflow`,
        );
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
      } as const satisfies Record<Exclude<typeof data.decision, null>, DocumentDecision>;

      const decision = data.decision ? Status[data.decision] : null;

      await this.peristDocumentsDesicions(
        [
          {
            id,
            decision,
            decisionReason: data.decisionReason as string,
            comment: data.comment as string,
          },
        ],
        projectIds,
        transaction,
      );

      const documents = await this.repository.findManyWithFiles(projectIds);

      return this.formatDocuments({
        documents,
        documentSchema: workflowDefinition.documentsSchema,
      });
    });
  }

  async updateDocumentsDecisionByIds(
    ids: string[],
    projectIds: TProjectId[],
    data: {
      decision: 'approve' | 'reject' | 'revision' | null;
    } & Pick<Prisma.DocumentUpdateInput, 'decisionReason' | 'comment'>,
    transaction?: PrismaTransactionClient,
  ) {
    if (!Array.isArray(ids) || !ids.length) {
      throw new BadRequestException('Document ids are required');
    }

    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return await beginTransactionIfNotExist(async transaction => {
      let documents = await this.repository.findMany(projectIds, {
        where: {
          id: { in: ids },
        },
        include: {
          workflowRuntimeData: {
            include: {
              workflowDefinition: true,
            },
          },
        },
      });

      const documentsWithPropertiesSchema = documents?.map(document =>
        addPropertiesSchemaToDocument(
          // @ts-expect-error -- the function expects properties not used by the function.
          document,
          (
            document as typeof document & {
              workflowRuntimeData: { workflowDefinition: WorkflowDefinition };
            }
          ).workflowRuntimeData.workflowDefinition.documentsSchema,
        ),
      );

      documentsWithPropertiesSchema.forEach(document => {
        const propertiesSchema = document.propertiesSchema ?? {};
        const shouldValidateDocument =
          data.decision === 'approve' && Object.keys(propertiesSchema)?.length;

        if (shouldValidateDocument) {
          const validatePropertiesSchema = ajv.compile(propertiesSchema);
          const isValidPropertiesSchema = validatePropertiesSchema(document?.properties);

          if (!isValidPropertiesSchema) {
            throw ValidationError.fromAjvError(validatePropertiesSchema.errors ?? []);
          }
        }
      });

      const Status = {
        approve: 'approved',
        reject: 'rejected',
        revision: 'revisions',
      } as const satisfies Record<Exclude<typeof data.decision, null>, DocumentDecision>;

      const decision = data.decision ? Status[data.decision] : null;
      const documentsWithDecisions = ids.map(id => ({
        id,
        decision,
        decisionReason: data.decisionReason as string,
        comment: data.comment as string,
      }));

      await this.peristDocumentsDesicions(documentsWithDecisions, projectIds, transaction);

      documents = await this.repository.findMany(projectIds, {
        where: {
          id: { in: ids },
        },
        include: {
          workflowRuntimeData: {
            include: {
              workflowDefinition: true,
            },
          },
        },
      });

      const documentsWithFiles = await this.repository.findManyWithFiles(projectIds);

      for (const document of documentsWithFiles) {
        await this.persistDocumentDecisionInContext(document, projectIds[0]!, transaction);
      }

      return this.formatDocuments({
        documents: documentsWithFiles,
        documentSchema: null,
      });
    });
  }

  private async persistDocumentDecisionInContext(
    document: Document,
    projectId: TProjectId,
    transaction?: PrismaTransactionClient,
  ) {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return await beginTransactionIfNotExist(async transaction => {
      if (!document.workflowRuntimeDataId) {
        throw new BadRequestException(
          `Document with id ${document.id} has no workflow runtime data id`,
        );
      }

      const workflowRuntime = await this.workflowService.getWorkflowRuntimeDataById(
        document.workflowRuntimeDataId,
        {
          select: {
            context: true,
            parentRuntimeDataId: true,
          },
        },
        [projectId],
      );

      if (!workflowRuntime) {
        throw new BadRequestException(
          `Workflow runtime data not found for document with id ${document.id}`,
        );
      }

      const isBusinessDocument = !!document.businessId;

      if (isBusinessDocument) {
        const businessDocuments = findBusinessDocumentsInContext(workflowRuntime.context);
        const matchingDocumentIndex = businessDocuments.findIndex(
          businessDocument =>
            businessDocument.type === document.type &&
            businessDocument.category === document.category,
        );
        const matchingDocument = businessDocuments[matchingDocumentIndex];

        if (!matchingDocument) {
          throw new BadRequestException(
            `Document with id ${document.id} is not a business document`,
          );
        }

        set(matchingDocument, '_document', document);

        // TODO: This is templorary until document structure is reworked
        // TODO: Remove this
        set(matchingDocument, 'pages[0].ballerineFileId', document.id);

        await this.workflowService.updateWorkflowRuntimeData(
          workflowRuntime.id,
          { context: workflowRuntime.context },
          projectId,
          transaction,
        );
      } else {
        const uiDefinition = await this.uiDefinitionService.getByWorkflowDefinitionId(
          workflowRuntime.workflowDefinitionId,
          'collection_flow',
          [projectId],
        );

        const uboDocuments = findUboDocumentsInUIDefinition(workflowRuntime.context, uiDefinition);

        uboDocuments.forEach(uboDocument => {
          if (
            uboDocument.ballerineEntityId === document.endUserId &&
            uboDocument.type === document.type &&
            uboDocument.category === document.category
          ) {
            set(uboDocument, '_document', document);
            set(uboDocument, 'pages[0].ballerineFileId', document.id);

            delete uboDocument.ballerineEntityId;
          }
        });

        await this.workflowService.updateWorkflowRuntimeData(
          workflowRuntime.id,
          { context: workflowRuntime.context },
          projectId,
          transaction,
        );
      }
    });
  }

  private async peristDocumentsDesicions(
    documents: {
      id: string;
      decision: DocumentDecision | null;
      decisionReason: string | null;
      comment: string | null;
    }[],
    projectIds: TProjectId[] = [],
    transaction?: PrismaTransactionClient,
  ) {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return await beginTransactionIfNotExist(async transaction => {
      await Promise.all(
        documents.map(document =>
          this.repository.updateById(
            document.id,
            projectIds,
            {
              decision: document.decision,
              decisionReason: document.decisionReason,
              comment: document.comment,
            },
            {},
            transaction,
          ),
        ),
      );
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

    await this.documentFileService.updateById(
      fileId,
      {
        file: {
          connect: { id: uploadedFile.id },
        },
      },
      projectIds,
    );

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
        documents: this.getLatestDocumentVersions(
          allDocuments.filter(doc => doc.businessId === entities.business.id),
        ),
      },
      ubos: entities.ubos.map(ubo => ({
        ...ubo,
        documents: this.getLatestDocumentVersions(
          allDocuments.filter(doc => doc.endUserId === ubo.id),
        ),
      })),
      directors: entities.directors.map(director => ({
        ...director,
        documents: this.getLatestDocumentVersions(
          allDocuments.filter(doc => doc.endUserId === director.id),
        ),
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
        },
        false,
      );
      const actualDocId = getDocumentId(
        {
          type: doc.type,
          category: doc.category,
          issuer: { country: doc.issuingCountry },
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
        decision: document.decision,
        files: files.map(({ file, ...fileData }) => ({
          ...fileData,
          fileName: file.fileName,
        })),
        propertiesSchema: documentWithPropertiesSchema.propertiesSchema,
      };
    });
  }

  getLatestDocumentVersions(documents: Document[]) {
    const documentsByType = documents.reduce((acc, document) => {
      const documentId = document.businessId
        ? getDocumentId(
            {
              type: document.type,
              category: document.category,
              issuingCountry: document.issuingCountry,
            },
            false,
          )
        : `${document.endUserId}-${document.type}-${document.category}-${document.issuingCountry}`;

      if (!acc[documentId]) {
        acc[documentId] = [];
      }

      acc[documentId]?.push(document);

      return acc;
    }, {} as Record<string, Document[]>);

    return Object.values(documentsByType).map(docs => {
      return docs.reduce((acc, curr) => {
        if (!acc) {
          return curr;
        }

        return (curr.version || 0) > (acc.version || 0) ? curr : acc;
      });
    });
  }

  async getDocumentFiles(documentId: string, projectIds: TProjectId[]) {
    return this.repository.findDocumentFiles(documentId, projectIds, { include: { file: true } });
  }
}
