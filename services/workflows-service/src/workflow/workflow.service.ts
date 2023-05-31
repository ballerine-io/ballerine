/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ApprovalState,
  Prisma,
  WorkflowDefinition,
  WorkflowRuntimeData,
  WorkflowRuntimeDataStatus,
} from '@prisma/client';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { CompleteWorkflowData, RunnableWorkflowData } from './types';
import { createWorkflow } from '@ballerine/workflow-node-sdk';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { isEqual, merge } from 'lodash';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowDefinitionCreateDto } from './dtos/workflow-definition-create';
import { WorkflowDefinitionFindManyArgs } from './dtos/workflow-definition-find-many-args';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { InputJsonValue, IObjectWithId } from '@/types';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import { BusinessRepository } from '@/business/business.repository';
import Ajv, { Schema } from 'ajv';
import addFormats from 'ajv-formats';
import { DefaultContextSchema } from './schemas/context';
import * as console from 'console';
import { TRemoteFileConfig, TS3BucketConfig } from '@/providers/file/types/files-types';
import { z } from 'zod';
import { HttpFileService } from '@/providers/file/file-provider/http-file.service';
import { LocalFileService } from '@/providers/file/file-provider/local-file.service';
import { AwsS3FileService } from '@/providers/file/file-provider/aws-s3-file.service';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import * as process from 'process';
import * as crypto from 'crypto';
import { TDefaultSchemaDocumentPage } from '@/workflow/schemas/default-context-page-schema';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import { TFileServiceProvider } from '@/providers/file/types';
import { updateDocuments } from '@/workflow/update-documents';
import { getDocumentId } from '@/workflow/utils';

type TEntityId = string;

const ajv = new Ajv({
  strict: false,
  coerceTypes: true,
});
addFormats(ajv, { formats: ['email', 'uri', 'date'] });

export const ResubmissionReason = {
  BLURRY_IMAGE: 'BLURRY_IMAGE',
  CUT_IMAGE: 'CUT_IMAGE',
  UNSUPPORTED_DOCUMENT: 'UNSUPPORTED_DOCUMENT',
  DAMAGED_DOCUMENT: 'DAMAGED_DOCUMENT',
  EXPIRED_DOCUMENT: 'EXPIRED_DOCUMENT',
  COPY_OF_A_COPY: 'COPY_OF_A_COPY',
  FACE_IS_UNCLEAR: 'FACE_IS_UNCLEAR',
  FACE_IS_NOT_MATCHING: 'FACE_IS_NOT_MATCHING',
} as const;
export interface WorkflowData {
  workflowDefinition: object;
  workflowRuntimeData: object;
}
export type TEntityType = 'endUser' | 'business';

// Discuss model classes location
export type IntentResponse = WorkflowData[];

// TODO: TEMP (STUB)
const policies = {
  kycSignup: () => {
    return [{ workflowDefinitionId: 'COLLECT_DOCS_b0002zpeid7bq9aaa', version: 1 }] as const;
  },
  kybSignup: () => {
    return [{ workflowDefinitionId: 'COLLECT_DOCS_b0002zpeid7bq9bbb', version: 1 }] as const;
  },
};

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    protected readonly workflowDefinitionRepository: WorkflowDefinitionRepository,
    protected readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
    protected readonly endUserRepository: EndUserRepository,
    protected readonly businessRepository: BusinessRepository,
    protected readonly storageService: StorageService,
    protected readonly fileService: FileService,
    protected readonly workflowEventEmitter: WorkflowEventEmitterService,
  ) {}

  async createWorkflowDefinition(data: WorkflowDefinitionCreateDto) {
    const select = {
      id: true,
      name: true,
      version: true,

      definition: true,
      definitionType: true,

      backend: true,

      extensions: true,
      persistStates: true,
      submitStates: true,
    };
    return await this.workflowDefinitionRepository.create({ data, select });
  }

  async getWorkflowRuntimeDataById(
    id: string,
    args?: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
  ) {
    return await this.workflowRuntimeDataRepository.findById(id, args);
  }

  async getWorkflowRuntimeDataByCorrelationId(
    id: string,
    args?: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
  ) {
    return await this.workflowRuntimeDataRepository.findById(id, args);
  }

  async getWorkflowDefinitionById(
    id: string,
    args?: Parameters<WorkflowDefinitionRepository['findById']>[1],
  ) {
    return await this.workflowDefinitionRepository.findById(id, args);
  }

  async listActiveWorkflowsRuntimeStates() {
    return await this.workflowRuntimeDataRepository.findMany({
      select: {
        state: true,
        endUserId: true,
        businessId: true,
        assigneeId: true,
        id: true,
        status: true,
      },
    });
  }

  async listWorkflowRuntimeDataByUserId(userId: string) {
    return await this.workflowRuntimeDataRepository.findMany({
      where: { endUserId: userId },
    });
  }

  async listFullWorkflowDataByUserId(userId: string): Promise<CompleteWorkflowData[]> {
    return (await this.workflowRuntimeDataRepository.findMany({
      // todo refactor
      where: { businessId: userId },
      include: { workflowDefinition: true },
    })) as CompleteWorkflowData[];
  }

  async listWorkflowDefinitions(args: WorkflowDefinitionFindManyArgs) {
    const select = {
      id: true,
      name: true,
      version: true,
      definition: true,
      definitionType: true,

      backend: true,

      extensions: true,
      persistStates: true,
      submitStates: true,
    };
    return await this.workflowDefinitionRepository.findMany({ ...args, select });
  }

  async updateWorkflowRuntimeData(workflowRuntimeId: string, data: WorkflowDefinitionUpdateInput) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(workflowRuntimeId);
    const workflowDef = await this.workflowDefinitionRepository.findById(
      runtimeData.workflowDefinitionId,
    );
    let contextHasChanged, mergedContext;
    if (data.context) {
      contextHasChanged = !isEqual(data.context, runtimeData.context);
      mergedContext = merge({}, runtimeData.context, data.context);
      const context = {
        ...mergedContext,
        // @ts-ignore
        documents: mergedContext?.documents?.map(
          // @ts-ignore
          ({ propertiesSchema: _propertiesSchema, id: _id, ...document }) => document,
        ),
      };

      const validateContextSchema = ajv.compile(
        (workflowDef?.contextSchema as any)?.schema as Schema,
      );
      const isValidContextSchema = validateContextSchema(context);

      if (!isValidContextSchema) {
        throw new BadRequestException(
          validateContextSchema.errors?.map(({ instancePath, message, ...rest }) => ({
            ...rest,
            instancePath,
            message: `${instancePath} ${message}`,
          })),
        );
      }

      // @ts-ignore
      data?.context?.documents?.forEach(({ propertiesSchema, id: _id, ...document }) => {
        const validatePropertiesSchema = ajv.compile(propertiesSchema);
        const isValidPropertiesSchema = validatePropertiesSchema(document?.properties);

        if (!isValidPropertiesSchema) {
          throw new BadRequestException(
            validatePropertiesSchema.errors?.map(({ instancePath, message, ...rest }) => ({
              ...rest,
              message: `${instancePath} ${message}`,
              instancePath,
            })),
          );
        }
      });
      data.context = mergedContext;
    }

    this.logger.log('Workflow state transition', {
      id: workflowRuntimeId,
      from: runtimeData.state,
      to: data.state,
    });

    // in case current state is a final state, we want to create another machine, of type manual review.
    // assign runtime to user, copy the context.
    const currentState = data.state;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isFinal = workflowDef.definition?.states?.[currentState]?.type === 'final';
    if (
      ['active'].includes(data.status! || runtimeData.status) &&
      workflowDef.config?.completedWhenTasksResolved
    ) {
      const allDocumentsResolved = data.context?.documents?.every(
        (document: DefaultContextSchema['documents'][number]) => {
          return ['approved', 'rejected'].includes(document?.decision?.status as string);
        },
      );

      data.status = allDocumentsResolved ? 'completed' : data.status! || runtimeData.status;
    }

    const isResolved = isFinal || data.status === WorkflowRuntimeDataStatus.completed;

    if (isResolved) {
      this.logger.log('Workflow resolved', { id: workflowRuntimeId });
    }

    const updateResult = await this.workflowRuntimeDataRepository.updateById(workflowRuntimeId, {
      data: {
        ...data,
        resolvedAt: isResolved ? new Date() : null,
      },
    });

    if (contextHasChanged) {
      this.workflowEventEmitter.emit('workflow.context.changed', {
        runtimeData,
        state: currentState as string,
        context: mergedContext,
      });
    }

    // TODO: Move to a separate method
    if (data.state) {
      if (isFinal && workflowDef.reviewMachineId) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await this.handleRuntimeFinalState(runtimeData, data.context, workflowDef);
      }
    }

    return updateResult;
  }

  async deleteWorkflowDefinitionById(
    id: string,
    args?: Parameters<WorkflowDefinitionRepository['deleteById']>[1],
  ) {
    return await this.workflowDefinitionRepository.deleteById(id, args);
  }

  async handleRuntimeFinalState(
    runtime: WorkflowRuntimeData,
    context: Record<string, unknown>,
    workflow: WorkflowDefinition,
  ) {
    // discuss error handling
    if (!workflow.reviewMachineId) {
      return;
    }
    const endUserId = runtime.endUserId;
    const businessId = runtime.businessId;
    endUserId &&
      (await this.endUserRepository.updateById(endUserId, {
        data: {
          approvalState: ApprovalState.PROCESSING,
        },
      }));
    businessId &&
      (await this.businessRepository.updateById(businessId, {
        data: {
          approvalState: ApprovalState.PROCESSING,
        },
      }));

    this.logger.log(`Entity state updated to ${ApprovalState.PROCESSING}`, {
      entityType: endUserId ? 'endUser' : 'business',
      entityId: endUserId || businessId,
    });

    // will throw exception if review machine def is missing
    await this.workflowDefinitionRepository.findById(workflow.reviewMachineId);

    const entitySearch: { businessId?: string; endUserId?: string } = {};

    if (businessId) {
      entitySearch.businessId = runtime.businessId as string;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      entitySearch.endUserId = runtime.endUserId as string;
    }

    const workflowRuntimeDataExists = await this.workflowRuntimeDataRepository.findOne({
      where: {
        ...entitySearch,
        context: {
          path: ['parentMachine', 'id'],
          equals: runtime.id,
        },
      },
    });

    if (!workflowRuntimeDataExists) {
      await this.workflowRuntimeDataRepository.create({
        data: {
          ...entitySearch,
          workflowDefinitionVersion: workflow.version,
          workflowDefinitionId: workflow.reviewMachineId,
          context: {
            ...context,
            parentMachine: {
              id: runtime.id,
            },
          },
          status: 'active',
        },
      });
    } else {
      await this.workflowRuntimeDataRepository.updateById(workflowRuntimeDataExists.id, {
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          context: context as any,
        },
      });
    }

    await this.updateWorkflowRuntimeData(runtime.id, {
      ...((runtime.context as { resubmissionReason: string })?.resubmissionReason
        ? {
            ...entitySearch,
            workflowDefinitionVersion: workflow.version,
            workflowDefinitionId: workflow.reviewMachineId,
            context: {
              ...context,
              parentMachine: {
                id: runtime.id,
              },
            },
          }
        : {}),
      status: 'completed',
    });
  }

  async resolveIntent(
    intent: string,
    entityId: string,
    tempEntityType: TEntityType,
  ): Promise<RunnableWorkflowData[]> {
    const workflowDefinitionResolver = policies[intent as keyof typeof policies];

    // TODO: implement logic for multiple workflows
    const { workflowDefinitionId } = workflowDefinitionResolver()[0];
    const context: DefaultContextSchema = {
      entity: { ballerineEntityId: entityId, entityType: tempEntityType },
      documents: [],
    };
    return this.createOrUpdateWorkflowRuntime({ workflowDefinitionId, context });
  }

  async createOrUpdateWorkflowRuntime({
    workflowDefinitionId,
    context,
  }: {
    workflowDefinitionId: string;
    context: DefaultContextSchema;
  }): Promise<RunnableWorkflowData[]> {
    const workflowDefinition = await this.workflowDefinitionRepository.findById(
      workflowDefinitionId,
    );
    this.__validateWorkflowDefinitionContext(workflowDefinition, context);
    const entityId = await this.__findOrPersistEntityInformation(context);
    const entityType = context.entity.type === 'business' ? 'business' : 'endUser';

    const existingWorkflowRuntimeData =
      await this.workflowRuntimeDataRepository.findActiveWorkflowByEntity({
        entityId,
        entityType,
        workflowDefinitionId: workflowDefinition.id,
      });

    let contextToInsert = structuredClone(context);

    if (existingWorkflowRuntimeData) {
      contextToInsert.documents = updateDocuments(
        existingWorkflowRuntimeData.context.documents,
        context.documents,
      );
    }

    contextToInsert = await this.__copyFileAndCreate(contextToInsert, entityId);

    const entityConnect = {
      [entityType]: {
        connect: { id: entityId },
      },
    };

    let workflowRuntimeData: WorkflowRuntimeData;

    if (!existingWorkflowRuntimeData) {
      workflowRuntimeData = await this.workflowRuntimeDataRepository.create({
        data: {
          ...entityConnect,
          workflowDefinitionVersion: workflowDefinition.version,
          context: contextToInsert as InputJsonValue,
          status: 'active',
          workflowDefinition: {
            connect: {
              id: workflowDefinition.id,
            },
          },
        },
      });
    } else {
      workflowRuntimeData = await this.workflowRuntimeDataRepository.updateById(
        existingWorkflowRuntimeData.id,
        {
          data: {
            ...entityConnect,
            context: contextToInsert as InputJsonValue,
          },
        },
      );
    }

    this.logger.log(existingWorkflowRuntimeData ? 'Workflow updated' : 'Workflow created', {
      workflowRuntimeDataId: workflowRuntimeData.id,
      entityId,
      entityType,
    });

    return [
      {
        workflowDefinition,
        workflowRuntimeData,
        ballerineEntityId: entityId,
      },
    ];
  }
  private async __copyFileAndCreate(
    context: DefaultContextSchema,
    entityId: TEntityId,
  ): Promise<DefaultContextSchema> {
    const documentsWithPersistedImages = await Promise.all(
      context.documents.map(async document => ({
        ...document,
        pages: await this.__persistDocumentPagesFiles(document, entityId),
      })),
    );

    return { ...context, documents: documentsWithPersistedImages };
  }

  private async __persistDocumentPagesFiles(
    document: DefaultContextSchema['documents'][number],
    entityId: string,
  ) {
    return await Promise.all(
      document.pages.map(async documentPage => {
        const ballerineFileId =
          documentPage.ballerineFileId ||
          (await this.__copyFileToDestinationAndCraeteFile(document, entityId, documentPage));

        return { ...documentPage, ballerineFileId };
      }),
    );
  }

  private async __copyFileToDestinationAndCraeteFile(
    document: DefaultContextSchema['documents'][number],
    entityId: string,
    documentPage: TDefaultSchemaDocumentPage,
  ) {
    const documentContext = getDocumentId(document).toLowerCase();
    const remoteFileName = `${documentContext}_${crypto.randomUUID()}.${documentPage.type}`;

    const { fromServiceProvider, fromRemoteFileConfig } =
      this.__fetchFromServiceProviders(documentPage);
    const { toServiceProvider, toRemoteFileConfig, remoteFileNameInDirectory } =
      this.__fetchToServiceProviders(entityId, remoteFileName);
    const { remoteFilePath, fileNameInBucket } =
      await this.fileService.copyFileFromSourceToDestination(
        fromServiceProvider,
        fromRemoteFileConfig,
        toServiceProvider,
        toRemoteFileConfig,
      );
    const userId = entityId;
    const ballerineFileId = await this.storageService.createFileLink({
      uri: remoteFileNameInDirectory,
      fileNameOnDisk: remoteFileNameInDirectory,
      userId,
      fileNameInBucket,
    });

    return ballerineFileId;
  }

  private async __findOrPersistEntityInformation(context: DefaultContextSchema) {
    const { entity } = context;
    const entityId = await this.__tryToFetchExistingEntityId(entity);

    if (entityId) {
      return entityId;
    }

    if (!entity.data) {
      throw new BadRequestException('Entity data is required');
    }

    if (entity.type === 'individual') {
      return await this.__persistEndUserInfo(entity, context);
    } else {
      return await this.__persistBusinessInformation(entity, context);
    }
  }

  private async __persistEndUserInfo(
    entity: { [p: string]: unknown },
    context: DefaultContextSchema,
  ) {
    const { id } = await this.endUserRepository.create({
      data: {
        correlationId: entity.id,
        ...(context.entity.data as object),
      } as Prisma.EndUserCreateInput,
    });
    return id;
  }

  private async __persistBusinessInformation(
    entity: { [p: string]: unknown },
    context: DefaultContextSchema,
  ) {
    const { id } = await this.businessRepository.create({
      data: {
        correlationId: entity.id,
        ...(context.entity.data as object),
      } as Prisma.BusinessCreateInput,
    });

    return id;
  }

  private async __tryToFetchExistingEntityId(entity: {
    [p: string]: unknown;
  }): Promise<TEntityId | null> {
    if (entity.ballerineEntityId) {
      return entity.ballerineEntityId as TEntityId;
    } else {
      if (entity.type === 'business') {
        const res = await this.businessRepository.findByCorrelationId(entity.id as TEntityId);
        return res && res.id;
      } else {
        const res = await this.endUserRepository.findByCorrelationId(entity.id as TEntityId);
        return res && res.id;
      }
    }
  }

  private __validateWorkflowDefinitionContext(
    workflowDefinition: WorkflowDefinition,
    context: DefaultContextSchema,
  ) {
    if (workflowDefinition.contextSchema && Object.keys(workflowDefinition.contextSchema).length) {
      const validate = ajv.compile((workflowDefinition.contextSchema as any).schema); // TODO: fix type
      const validationResult = validate(context);

      if (!validationResult) {
        console.log(validate.errors);
        throw new BadRequestException('Invalid context', JSON.stringify(validate.errors));
      }
    }
  }

  async event({
    name: type,
    document,
    resubmissionReason,
    id,
  }: WorkflowEventInput & IObjectWithId) {
    this.logger.log('Workflow event received', { id, type });
    const runtimeData = await this.workflowRuntimeDataRepository.findById(id);
    const workflow = await this.workflowDefinitionRepository.findById(
      runtimeData.workflowDefinitionId,
    );

    const service = createWorkflow({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      definition: workflow.definition as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      definitionType: workflow.definitionType as any,
      workflowContext: {
        machineContext: runtimeData.context,
        state: runtimeData.state,
      },
    });

    await service.sendEvent({
      type,
    });

    const snapshot = service.getSnapshot();
    const currentState = snapshot.value;
    const context = snapshot.machine.context;
    const isFinal = snapshot.machine.states[currentState].type === 'final';

    this.logger.log('Workflow state transition', {
      id: id,
      from: runtimeData.state,
      to: currentState,
    });

    if (type === 'resubmit' && document) {
      switch (resubmissionReason) {
        case ResubmissionReason.BLURRY_IMAGE:
          await this.workflowRuntimeDataRepository.updateById(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            (runtimeData as any).context?.parentMachine?.id,
            {
              data: {
                state: 'document_photo',
                status: 'active',
                context: {
                  ...context,
                  [document]: {
                    ...context?.[document],
                    resubmissionReason,
                  },
                },
              },
            },
          );
          break;
        default:
          throw new BadRequestException(
            `Invalid resubmission reason ${resubmissionReason as string}`,
          );
      }
    }

    await this.updateWorkflowRuntimeData(runtimeData.id, {
      context,
      state: currentState,
      status: isFinal ? 'completed' : runtimeData.status,
    });

    if (!isFinal || (currentState !== 'approved' && currentState !== 'rejected')) {
      return;
    }

    runtimeData.endUserId &&
      (await this.endUserRepository.updateById(runtimeData.endUserId, {
        data: {
          approvalState: ApprovalState[currentState.toUpperCase() as keyof typeof ApprovalState],
        },
      }));
  }

  private __fetchFromServiceProviders(document: TDefaultSchemaDocumentPage): {
    fromServiceProvider: TFileServiceProvider;
    fromRemoteFileConfig: TRemoteFileConfig;
  } {
    if (document.provider == 'http' && z.string().parse(document.uri)) {
      return { fromServiceProvider: new HttpFileService(), fromRemoteFileConfig: document.uri };
    }
    if (document.provider == 'aws_s3' && z.string().parse(document.uri)) {
      const prefixConfigName = `REMOTE`;
      const s3ClientConfig = AwsS3FileConfig.fetchClientConfig(process.env, prefixConfigName);
      const s3BucketConfig = this.__fetchAwsConfigFor(document.uri);

      return {
        fromServiceProvider: new AwsS3FileService(s3ClientConfig),
        fromRemoteFileConfig: s3BucketConfig,
      };
    }

    return { fromServiceProvider: new LocalFileService(), fromRemoteFileConfig: document.uri };
  }

  private __fetchToServiceProviders(
    entityId: string,
    fileName: string,
  ): {
    toServiceProvider: TFileServiceProvider;
    toRemoteFileConfig: TRemoteFileConfig;
    remoteFileNameInDirectory: string;
  } {
    if (this.__fetchBucketName(process.env, false)) {
      const s3ClientConfig = AwsS3FileConfig.fetchClientConfig(process.env);
      const awsFileService = new AwsS3FileService(s3ClientConfig);
      const remoteFileNameInDocument = awsFileService.generateRemoteFilePath(fileName, entityId);
      const awsConfigForClient = this.__fetchAwsConfigFor(remoteFileNameInDocument);
      return {
        toServiceProvider: awsFileService,
        toRemoteFileConfig: awsConfigForClient,
        remoteFileNameInDirectory: awsConfigForClient.fileNameInBucket,
      };
    }

    const localFileService = new LocalFileService();
    const toFileStoragePath = localFileService.generateRemoteFilePath(fileName);
    return {
      toServiceProvider: localFileService,
      toRemoteFileConfig: toFileStoragePath,
      remoteFileNameInDirectory: toFileStoragePath,
    };
  }

  private __fetchAwsConfigFor(fileNameInBucket: string): TS3BucketConfig {
    const bucketName = this.__fetchBucketName(process.env, true) as string;

    return {
      bucketName: bucketName,
      fileNameInBucket: fileNameInBucket,
      private: true,
    };
  }

  private __fetchBucketName(processEnv: NodeJS.ProcessEnv, isThrowOnMissing = true) {
    const bucketName = AwsS3FileConfig.fetchBucketName(processEnv);

    if (isThrowOnMissing && !bucketName) {
      throw new Error(`S3 Bucket name is not set`);
    }

    return bucketName;
  }

  async getWorkflowRuntimeDataContext(id: string) {
    return this.workflowRuntimeDataRepository.findContext(id);
  }
}
