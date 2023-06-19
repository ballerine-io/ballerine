/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ApprovalState,
  Business,
  EndUser,
  Prisma,
  WorkflowDefinition,
  WorkflowRuntimeData,
  WorkflowRuntimeDataStatus,
} from '@prisma/client';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { RunnableWorkflowData, TWorkflowWithRelations } from './types';
import { createWorkflow } from '@ballerine/workflow-node-sdk';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { isEqual, merge } from 'lodash';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowDefinitionCreateDto } from './dtos/workflow-definition-create';
import { WorkflowDefinitionFindManyArgs } from './dtos/workflow-definition-find-many-args';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { InputJsonValue, IObjectWithId } from '@/types';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import { BusinessRepository } from '@/business/business.repository';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { TRemoteFileConfig, TS3BucketConfig } from '@/providers/file/types/files-types';
import { z } from 'zod';
import { HttpFileService } from '@/providers/file/file-provider/http-file.service';
import { LocalFileService } from '@/providers/file/file-provider/local-file.service';
import { AwsS3FileService } from '@/providers/file/file-provider/aws-s3-file.service';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import * as process from 'process';
import * as crypto from 'crypto';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import { TFileServiceProvider } from '@/providers/file/types';
import { updateDocuments } from '@/workflow/update-documents';
import { WorkflowAssigneeId } from '@/workflow/dtos/workflow-assignee-id';
import { ConfigSchema, WorkflowConfig } from './schemas/zod-schemas';
import { toPrismaOrderBy } from '@/workflow/utils/toPrismaOrderBy';
import { toPrismaWhere } from '@/workflow/utils/toPrismaWhere';
import {
  DefaultContextSchema,
  getDocumentId,
  getDocumentsByCountry,
  TDefaultSchemaDocumentPage,
} from '@ballerine/common';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';

type TEntityId = string;

const ajv = new Ajv({
  strict: false,
  coerceTypes: true,
});
addFormats(ajv, { formats: ['email', 'uri', 'date'] });
addKeywords(ajv);

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

  async getWorkflowByIdWithRelations(
    id: string,
    args?: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
  ) {
    const workflow = (await this.workflowRuntimeDataRepository.findById(
      id,
      args,
    )) as TWorkflowWithRelations;

    return this.formatWorkflow(workflow);
  }

  private formatWorkflow(workflow: TWorkflowWithRelations) {
    const isIndividual = 'endUser' in workflow;
    const service = createWorkflow({
      definition: workflow.workflowDefinition as any,
      definitionType: workflow.workflowDefinition.definitionType,
      workflowContext: {
        machineContext: workflow.context,
        state: workflow.state,
      },
    });

    return {
      ...workflow,
      context: {
        ...workflow.context,
        documents: workflow.context?.documents?.map(
          (document: DefaultContextSchema['documents'][number]) => {
            const documentsByCountry = getDocumentsByCountry(document?.issuer?.country);
            const documentByCountry = documentsByCountry?.find(
              doc => getDocumentId(doc, false) === getDocumentId(document, false),
            );

            return {
              ...document,
              propertiesSchema: documentByCountry?.propertiesSchema ?? {},
            };
          },
        ),
      },
      entity: {
        id: isIndividual ? workflow.endUser.id : workflow.business.id,
        name: isIndividual
          ? `${String(workflow.endUser.firstName)} ${String(workflow.endUser.lastName)}`
          : workflow.business.companyName,
        avatarUrl: isIndividual ? workflow.endUser.avatarUrl : null,
        approvalState: isIndividual
          ? workflow.endUser.approvalState
          : workflow.business.approvalState,
      },
      endUser: undefined,
      business: undefined,
      nextEvents: service.getSnapshot().nextEvents,
    };
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
        workflowDefinitionId: true,
      },
    });
  }

  async listWorkflowRuntimeDataWithRelations({
    args,
    entityType,
    orderBy,
    page,
    filters,
  }: {
    args: Parameters<WorkflowRuntimeDataRepository['findMany']>[0];
    entityType: 'individuals' | 'businesses';
    orderBy: Parameters<typeof toPrismaOrderBy>[0];
    page: {
      number: number;
      size: number;
    };
    filters?: {
      assigneeId?: (string | null)[];
      status?: WorkflowRuntimeDataStatus[];
    };
  }) {
    const query = merge(
      args,
      {
        orderBy: toPrismaOrderBy(orderBy, entityType),
        where: filters ? toPrismaWhere(filters) : {},
        skip: (page.number - 1) * page.size,
        take: page.size,
      },
      {
        where:
          entityType === 'individuals'
            ? {
                endUserId: { not: null },
              }
            : {
                businessId: { not: null },
              },
      },
    );

    const totalWorkflowsCount = await this.workflowRuntimeDataRepository.count({
      where: query.where,
    });

    if (page.number > 1 && totalWorkflowsCount < (page.number - 1) * page.size + 1) {
      throw new NotFoundException('Page not found');
    }

    const workflows = await this.workflowRuntimeDataRepository.findMany(query);

    return {
      data: this.formatWorkflowsRuntimeData(workflows as unknown as TWorkflowWithRelations[]),
      meta: {
        totalItems: totalWorkflowsCount,
        totalPages: Math.max(Math.ceil(totalWorkflowsCount / page.size), 1),
      },
    };
  }

  private formatWorkflowsRuntimeData(workflows: TWorkflowWithRelations[]) {
    return workflows.map(workflow => {
      const isIndividual = 'endUser' in workflow;

      console.log('workflow', workflow);

      return {
        id: workflow?.id,
        status: workflow?.status,
        createdAt: workflow?.createdAt,
        entity: {
          id: isIndividual ? workflow?.endUser?.id : workflow?.business?.id,
          name: isIndividual
            ? `${String(workflow?.endUser?.firstName)} ${String(workflow?.endUser?.lastName)}`
            : workflow?.business?.companyName,
          avatarUrl: isIndividual ? workflow?.endUser?.avatarUrl : null,
          approvalState: isIndividual
            ? workflow?.endUser?.approvalState
            : workflow?.business?.approvalState,
        },
        assignee: workflow?.assigneeId
          ? {
              id: workflow?.assigneeId,
              firstName: workflow?.assignee?.firstName,
              lastName: workflow?.assignee?.lastName,
            }
          : null,
      };
    });
  }

  async listWorkflowRuntimeDataByUserId(userId: string) {
    return await this.workflowRuntimeDataRepository.findMany({
      where: { endUserId: userId },
    });
  }

  async listFullWorkflowDataByUserId({
    entityId,
    entity,
  }: {
    entityId: string;
    entity: TEntityType;
  }) {
    return await this.workflowRuntimeDataRepository.findMany({
      where: {
        [`${entity}Id`]: entityId,
      },
      include: { workflowDefinition: true },
    });
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

    const correlationId: string = await this.getCorrelationIdFromWorkflow(runtimeData);

    let contextHasChanged, mergedContext;
    if (data.context) {
      data.context.documents = assignIdToDocuments(data.context.documents);
      contextHasChanged = !isEqual(data.context, runtimeData.context);
      mergedContext = merge({}, runtimeData.context, data.context);

      const context = {
        ...mergedContext,
        // @ts-ignore
        documents: mergedContext?.documents?.map(
          // @ts-ignore
          // Validating the context should be done without the propertiesSchema
          ({ propertiesSchema: _propertiesSchema, ...document }) => document,
        ),
      };

      this.__validateWorkflowDefinitionContext(workflowDef, context);

      // @ts-ignore
      data?.context?.documents?.forEach(({ propertiesSchema, ...document }) => {
        if (!Object.keys(propertiesSchema ?? {})?.length) return;

        const validatePropertiesSchema = ajv.compile(propertiesSchema ?? {});
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
      // TODO: Check against `contextSchema` or a policy if the length of documents is equal to the number of tasks defined.
      const allDocumentsResolved =
        data.context?.documents?.length &&
        data.context?.documents?.every((document: DefaultContextSchema['documents'][number]) => {
          return ['approved', 'rejected'].includes(document?.decision?.status as string);
        });

      data.status = allDocumentsResolved ? 'completed' : data.status! || runtimeData.status;
    }

    const isResolved = isFinal || data.status === WorkflowRuntimeDataStatus.completed;

    if (isResolved) {
      this.logger.log('Workflow resolved', { id: workflowRuntimeId });
    }

    const documentToRevise = data.context?.documents?.find(
      ({ decision }: { decision: DefaultContextSchema['documents'][number]['decision'] }) =>
        decision?.status === 'revision',
    );
    let updatedResult;

    if (documentToRevise && !workflowDef.reviewMachineId) {
      const parentMachine = await this.workflowRuntimeDataRepository.findById(
        runtimeData?.context?.parentMachine?.id,
        {
          include: {
            workflowDefinition: {
              select: {
                definition: true,
              },
            },
          },
        },
      );

      // Updates the collect documents workflow with the manual review workflow's decision.
      await this.workflowRuntimeDataRepository.updateById(parentMachine?.id, {
        data: {
          status: 'active',
          state: parentMachine?.workflowDefinition?.definition?.initial as string,
          context: {
            ...parentMachine?.context,
            documents: parentMachine?.context?.documents?.map((document: any) => {
              if (document.id !== documentToRevise.id) return document;

              return {
                ...document,
                decision: documentToRevise.decision,
              };
            }),
          },
        },
      });

      updatedResult = await this.workflowRuntimeDataRepository.updateById(workflowRuntimeId, {
        data: {
          ...data,
          context: {
            ...data.context,
            parentMachine: {
              id: parentMachine?.id,
              status: 'active',
            },
          },
          resolvedAt: isResolved ? new Date() : null,
        },
      });
    } else {
      updatedResult = await this.workflowRuntimeDataRepository.updateById(workflowRuntimeId, {
        data: {
          ...data,
          resolvedAt: isResolved ? new Date() : null,
        },
      });
    }

    if (contextHasChanged) {
      this.workflowEventEmitter.emit('workflow.context.changed', {
        runtimeData,
        state: currentState as string,
        context: mergedContext,
        entityId: (runtimeData.businessId || runtimeData.endUserId) as string,
        correlationId: correlationId,
      });
    }

    // TODO: Move to a separate method
    if (data.state && isFinal && workflowDef.reviewMachineId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.handleRuntimeFinalState(runtimeData, data.context, workflowDef);
    }

    return updatedResult;
  }

  async assignWorkflowToUser(workflowRuntimeId: string, { assigneeId }: WorkflowAssigneeId) {
    const updatedWorkflowRuntime = await this.workflowRuntimeDataRepository.updateById(
      workflowRuntimeId,
      { data: { assigneeId: assigneeId } },
    );

    return updatedWorkflowRuntime;
  }

  private async getCorrelationIdFromWorkflow(runtimeData: WorkflowRuntimeData) {
    let correlationId: string;
    if (runtimeData.businessId) {
      correlationId = (await this.businessRepository.getCorrelationIdById(
        runtimeData.businessId,
      )) as string;
    } else if (runtimeData.endUserId) {
      correlationId = (await this.endUserRepository.getCorrelationIdById(
        runtimeData.endUserId,
      )) as string;
    } else {
      correlationId = '';
      console.error('No entity Id found');
      // throw new Error('No entity Id found');
    }
    return correlationId;
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

    const entityId = endUserId || businessId;

    this.logger.log(`Entity state updated to ${ApprovalState.PROCESSING}`, {
      entityType: endUserId ? 'endUser' : 'business',
      entityId,
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

    const manualReviewWorkflow = await this.workflowRuntimeDataRepository.findOne({
      where: {
        ...entitySearch,
        context: {
          path: ['parentMachine', 'id'],
          equals: runtime.id,
        },
      },
    });

    if (!manualReviewWorkflow) {
      await this.workflowRuntimeDataRepository.create({
        data: {
          ...entitySearch,
          workflowDefinitionVersion: workflow.version,
          workflowDefinitionId: workflow.reviewMachineId,
          context: {
            ...context,
            parentMachine: {
              id: runtime.id,
              status: 'completed',
            },
          },
          status: 'active',
        },
      });
    } else {
      await this.workflowRuntimeDataRepository.updateById(manualReviewWorkflow.id, {
        data: {
          context: {
            ...manualReviewWorkflow.context,
            parentMachine: {
              id: runtime.id,
              status: 'completed',
            },
          },
        },
      });
    }

    await this.updateWorkflowRuntimeData(runtime.id, {
      status: 'completed',
    });
  }

  async resolveIntent(
    intent: string,
    entityId: string,
    entityType: TEntityType,
  ): Promise<RunnableWorkflowData[]> {
    const workflowDefinitionResolver = policies[intent as keyof typeof policies];
    const entity = await (async () => {
      if (entityType === 'business') return await this.businessRepository.findById(entityId);
      if (entityType === 'endUser') return await this.endUserRepository.findById(entityId);

      throw new BadRequestException(`Invalid entity type ${entityType}`);
    })();
    const isBusinessEntity = (entity: EndUser | Business): entity is Business =>
      entityType === 'business';

    // TODO: implement logic for multiple workflows
    const { workflowDefinitionId } = workflowDefinitionResolver()[0];
    const context: DefaultContextSchema = {
      entity: {
        ballerineEntityId: entityId,
        type: entityType,
        data: {
          ...(isBusinessEntity(entity)
            ? {
                companyName: entity?.companyName,
                registrationNumber: entity?.registrationNumber,
              }
            : {
                firstName: entity?.firstName,
                lastName: entity?.lastName,
              }),
        },
      },
      documents: [],
    };
    return this.createOrUpdateWorkflowRuntime({ workflowDefinitionId, context });
  }

  async createOrUpdateWorkflowRuntime({
    workflowDefinitionId,
    context,
    config,
  }: {
    workflowDefinitionId: string;
    context: DefaultContextSchema;
    config?: WorkflowConfig;
  }): Promise<RunnableWorkflowData[]> {
    const workflowDefinition = await this.workflowDefinitionRepository.findById(
      workflowDefinitionId,
    );
    config = merge(workflowDefinition.config, config);
    let validatedConfig: WorkflowConfig;
    try {
      validatedConfig = ConfigSchema.parse(config);
    } catch (error) {
      throw new BadRequestException(error);
    }
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

    const entityConnect = {
      [entityType]: {
        connect: { id: entityId },
      },
    };

    let workflowRuntimeData: WorkflowRuntimeData, newWorkflowCreated: boolean;

    if (!existingWorkflowRuntimeData || config?.allowMultipleActiveWorkflows) {
      contextToInsert = await this.__copyFileAndCreate(contextToInsert, entityId);
      workflowRuntimeData = await this.workflowRuntimeDataRepository.create({
        data: {
          ...entityConnect,
          workflowDefinitionVersion: workflowDefinition.version,
          context: contextToInsert as InputJsonValue,
          config: merge(workflowDefinition.config, validatedConfig || {}) as InputJsonValue,
          status: 'active',
          workflowDefinition: {
            connect: {
              id: workflowDefinition.id,
            },
          },
        },
      });
      newWorkflowCreated = true;
    } else {
      contextToInsert.documents = updateDocuments(
        existingWorkflowRuntimeData.context.documents,
        context.documents,
      );

      contextToInsert = await this.__copyFileAndCreate(contextToInsert, entityId);
      workflowRuntimeData = await this.workflowRuntimeDataRepository.updateById(
        existingWorkflowRuntimeData.id,
        {
          data: {
            ...entityConnect,
            context: contextToInsert as InputJsonValue,
            config: merge(
              existingWorkflowRuntimeData.config,
              validatedConfig || {},
            ) as InputJsonValue,
          },
        },
      );
      newWorkflowCreated = false;
    }

    this.logger.log(existingWorkflowRuntimeData ? 'Workflow updated' : 'Workflow created', {
      workflowRuntimeDataId: workflowRuntimeData.id,
      entityId,
      entityType,
      newWorkflowCreated,
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
    const remoteFileName = `${document.id!}_${crypto.randomUUID()}.${documentPage.type}`;

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
    if (!Object.keys(workflowDefinition?.contextSchema ?? {}).length) return;

    const validate = ajv.compile((workflowDefinition?.contextSchema as any)?.schema); // TODO: fix type
    const isValid = validate(context);

    if (isValid) return;

    throw new BadRequestException(
      validate.errors?.map(({ instancePath, message, ...rest }) => ({
        ...rest,
        instancePath,
        message: `${instancePath} ${message}`,
      })),
    );
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
      definition: workflow.definition,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      definitionType: workflow.definitionType,
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

    // TODO: Update to work with changes related to revision
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
