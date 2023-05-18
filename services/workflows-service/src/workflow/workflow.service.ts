/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApprovalState, Prisma, WorkflowDefinition, WorkflowRuntimeData } from '@prisma/client';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { CompleteWorkflowData, RunnableWorkflowData } from './types';
import { createWorkflow } from '@ballerine/workflow-node-sdk';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { merge } from 'lodash';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { IObjectWithId } from '@/types';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import { BusinessRepository } from '@/business/business.repository';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { DefaultContextSchema } from './schemas/context';
import * as console from 'console';
import { TFileServiceProvider, TRemoteFileConfig, TS3BucketConfig } from '@/providers/file/types';
import { z } from 'zod';
import { HttpFileService } from '@/providers/file/file-provider/http-file.service';
import { LocalFileService } from '@/providers/file/file-provider/local-file.service';
import { AwsS3FileService } from '@/providers/file/file-provider/aws-s3-file.service';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import * as process from 'process';
import * as crypto from 'crypto';
import { TDefaultSchemaDocumentPage } from '@/workflow/schemas/default-context-page-schema';
import { env } from '@/env';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import { S3Client } from '@aws-sdk/client-s3';

type TEntityId = string;
const ajv = new Ajv({
  strict: false,
});
addFormats(ajv, { formats: ['email', 'uri'] });
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
    private workflowEventEmitter: WorkflowEventEmitterService,
  ) {}

  async createWorkflowDefinition(args: Parameters<WorkflowDefinitionRepository['create']>[0]) {
    return await this.workflowDefinitionRepository.create(args);
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

  async listWorkflowDefinitions(args?: Parameters<WorkflowDefinitionRepository['findMany']>[0]) {
    return await this.workflowDefinitionRepository.findMany(args);
  }

  async updateWorkflowRuntimeData(workflowRuntimeId: string, data: WorkflowDefinitionUpdateInput) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(workflowRuntimeId);
    const ajv = new Ajv();
    // const validate = ajv.compile(runtimeData.contextSchema);

    data.context = merge(runtimeData.context, data.context);

    this.logger.log(
      `Context update receivied from client: [${runtimeData.state} -> ${data.state} ]`,
    );

    // in case current state is a final state, we want to create another machine, of type manual review.
    // assign runtime to user, copy the context.
    const currentState = data.state;
    const workflow = await this.workflowDefinitionRepository.findById(
      runtimeData.workflowDefinitionId,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isFinal = workflow.definition?.states?.[currentState]?.type === 'final';

    const updateResult = await this.workflowRuntimeDataRepository.updateById(workflowRuntimeId, {
      data: {
        ...data,
        resolvedAt: isFinal ? new Date() : undefined,
      },
    });

    if (isFinal) {
      this.workflowEventEmitter.emit('workflow.completed', {
        runtimeData,
        state: currentState as string,
        context: runtimeData.context, // TODO: final result should be a subset of context, should be defined as part of the workflow definition
      });
    }

    // TODO: Move to a separate method
    if (data.state) {
      if (isFinal && workflow.reviewMachineId) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await this.handleRuntimeFinalState(runtimeData, data.context, workflow);
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

    this.logger.log(`${businessId || endUserId} is now in state ${ApprovalState.PROCESSING}`);

    // will throw exception if review machine def is missing
    await this.workflowDefinitionRepository.findById(workflow.reviewMachineId);

    const entitySerach: { businessId?: string; endUserId?: string } = {};

    if (businessId) {
      entitySerach.businessId = runtime.businessId as string;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      entitySerach.endUserId = runtime.endUserId as string;
    }

    const workflowRuntimeDataExists = await this.workflowRuntimeDataRepository.findOne({
      where: {
        ...entitySerach,
        context: {
          path: ['parentMachine', 'id'],
          equals: runtime.id,
        },
      },
    });

    if (!workflowRuntimeDataExists) {
      await this.workflowRuntimeDataRepository.create({
        data: {
          ...entitySerach,
          workflowDefinitionVersion: workflow.version,
          workflowDefinitionId: workflow.reviewMachineId,
          context: {
            ...context,
            parentMachine: {
              id: runtime.id,
            },
          },
          status: 'created',
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
            ...entitySerach,
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
    return this.createWorkflowRuntime({ workflowDefinitionId, context });
  }

  async createWorkflowRuntime({
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
    const { entityId, entityConnect } = await this.__findOrPersistEntityInformation(context);
    const contextWithPersistedFileIds = await this.__copyFileAndCreate(context, entityId);

    const workflowRuntimeData = await this.workflowRuntimeDataRepository.create({
      data: {
        ...entityConnect,
        workflowDefinitionVersion: workflowDefinition.version,
        context: contextWithPersistedFileIds,
        status: 'created',
        workflowDefinition: {
          connect: {
            id: workflowDefinitionId,
          },
        },
      },
    });

    this.logger.log(
      `Created workflow runtime data ${workflowRuntimeData.id}, for user ${entityId}, with workflow ${workflowDefinitionId}, version ${workflowDefinition.version}`,
    );

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
    const documentContext =
      `${document?.category}-${document?.type}-${document?.issuer?.country}`.toLowerCase();
    const documentName = `${entityId}/${documentContext}_${crypto.randomUUID()}.${
      documentPage.type
    }`;

    const { fromServiceProvider, fromRemoteFileConfig } =
      this.__fetchFromServiceProviders(documentPage);
    const { toServiceProvider, toRemoteFileConfig, remoteFileName } =
      this.__fetchToServiceProviders(documentName);

    const remoteFilePath = await this.fileService.copyFileFromSourceToDestination(
      fromServiceProvider,
      fromRemoteFileConfig,
      toServiceProvider,
      toRemoteFileConfig,
    );
    const fileNameInBucket =
      typeof remoteFilePath != 'string' ? remoteFilePath.fileNameInBucket : undefined;
    const userId = entityId;
    const ballerineFileId = await this.storageService.createFileLink({
      uri: remoteFileName,
      fileNameOnDisk: remoteFileName,
      userId,
      fileNameInBucket,
    });
    return ballerineFileId;
  }

  private async __findOrPersistEntityInformation(context: DefaultContextSchema) {
    const { entity } = context;
    const entityId = await this.__tryToFetchExistingEntityId(entity);

    if (!entityId) {
      if (!entity.data) throw new BadRequestException('Entity data is required');
    }

    let persistedEntityId = entityId;
    const entityConnect: any = {} as any;
    if (entity.type === 'individual') {
      persistedEntityId = persistedEntityId || (await this.__persistEndUserInfo(entity, context));

      entityConnect.endUser = {
        connect: {
          id: persistedEntityId,
        },
      };
    } else {
      persistedEntityId =
        persistedEntityId || (await this.__persistBusinessInformation(entity, context));

      entityConnect.business = {
        connect: {
          id: persistedEntityId,
        },
      };
    }
    return { entityId: persistedEntityId, entityConnect };
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

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.logger.log(
      `Workflow ${workflow.name}-${id}-v${workflow.version} state transiation [${runtimeData.state} -> ${currentState}]`,
    );
    if (isFinal) {
      this.workflowEventEmitter.emit('workflow.completed', {
        runtimeData,
        state: currentState,
        context, // TODO: final result should be a subset of context, should be defined as part of the workflow definition
      });
    }

    if (type === 'resubmit' && document) {
      switch (resubmissionReason) {
        case ResubmissionReason.BLURRY_IMAGE:
          await this.workflowRuntimeDataRepository.updateById(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            (runtimeData as any).context?.parentMachine?.id,
            {
              data: {
                state: 'document_photo',
                status: 'created',
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

  private __fetchToServiceProviders(fileName: string): {
    toServiceProvider: TFileServiceProvider;
    toRemoteFileConfig: TRemoteFileConfig;
    remoteFileName: string;
  } {
    if (this.__fetchBucketName(process.env, false)) {
      const s3ClientConfig = AwsS3FileConfig.fetchClientConfig(process.env);
      const awsConfigForClient = this.__fetchAwsConfigFor(fileName);
      return {
        toServiceProvider: new AwsS3FileService(s3ClientConfig),
        toRemoteFileConfig: awsConfigForClient,
        remoteFileName: awsConfigForClient.fileNameInBucket,
      };
    }

    return {
      toServiceProvider: new LocalFileService(),
      toRemoteFileConfig: fileName,
      remoteFileName: fileName,
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
}
