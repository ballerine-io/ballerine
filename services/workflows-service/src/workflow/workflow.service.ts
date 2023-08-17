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
import {
  ListRuntimeDataResult,
  ListWorkflowsRuntimeParams,
  RunnableWorkflowData,
  TWorkflowWithRelations,
  WorkflowRuntimeListQueryResult,
} from './types';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { isEqual, merge } from 'lodash';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowDefinitionCreateDto } from './dtos/workflow-definition-create';
import { WorkflowDefinitionFindManyArgs } from './dtos/workflow-definition-find-many-args';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { InputJsonValue, IObjectWithId, TProjectIds } from '@/types';
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
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';
import {
  WorkflowAssignee,
  WorkflowRuntimeListItemModel,
} from '@/workflow/workflow-runtime-list-item.model';
import { plainToClass } from 'class-transformer';
import { SortOrder } from '@/common/query-filters/sort-order';
import { aliasIndividualAsEndUser } from '@/common/utils/alias-individual-as-end-user/alias-individual-as-end-user';
import { EntityRepository } from '@/common/entity/entity.repository';
import {
  ChildPluginCallbackOutput,
  ChildToParentCallback,
  ChildWorkflowCallback,
  createWorkflow,
  HelpersTransformer,
  JmespathTransformer,
  SerializableTransformer,
  THelperFormatingLogic,
  Transformer,
} from '@ballerine/workflow-core';
import { ProjectScopeService } from '@/project/project-scope.service';
import { GetLastActiveFlowParams } from '@/workflow/types/params';
import { EndUserService } from '@/end-user/end-user.service';

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
  constructor(
    protected readonly workflowDefinitionRepository: WorkflowDefinitionRepository,
    protected readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
    protected readonly endUserRepository: EndUserRepository,
    protected readonly endUserService: EndUserService,
    protected readonly businessRepository: BusinessRepository,
    protected readonly entityRepository: EntityRepository,
    protected readonly storageService: StorageService,
    protected readonly fileService: FileService,
    protected readonly workflowEventEmitter: WorkflowEventEmitterService,
    private readonly logger: AppLoggerService,
    private readonly projectScopeService: ProjectScopeService,
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
      parentRuntimeDataId: true,
    };
    return await this.workflowDefinitionRepository.create({ data, select });
  }

  async getWorkflowRuntimeDataById(
    id: string,
    args?: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
  ) {
    return await this.workflowRuntimeDataRepository.findById(id, args);
  }

  async getWorkflowRuntimeWithChildrenDataById(
    id: string,
    args?: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
  ) {
    return await this.workflowRuntimeDataRepository.findById(id, {
      ...args,
    });
  }

  async getWorkflowByIdWithRelations(
    id: string,
    args?: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
  ) {
    const allEntities = { endUser: true, business: true };
    const childWorkflowSelectArgs = {
      select: { ...args?.select, ...allEntities },
      include: args?.include,
    };
    const workflow = (await this.workflowRuntimeDataRepository.findById(id, {
      ...args,
      select: {
        ...(args?.select || {}),
        childWorkflowsRuntimeData: { ...childWorkflowSelectArgs },
      },
    })) as TWorkflowWithRelations;

    return this.formatWorkflow(workflow);
  }

  private formatWorkflow(
    workflow: TWorkflowWithRelations,
    addNextEvents = true,
  ): TWorkflowWithRelations {
    const isIndividual = 'endUser' in workflow;

    let nextEvents;
    if (addNextEvents) {
      const service = createWorkflow({
        runtimeId: workflow.id,
        definition: workflow.workflowDefinition.definition,
        definitionType: workflow.workflowDefinition.definitionType,
        workflowContext: {
          machineContext: workflow.context,
          state: workflow.state ?? workflow.workflowDefinition.definition?.initial,
        },
      });

      nextEvents = service.getSnapshot().nextEvents;
    }

    // @ts-expect-error - typescript does not like recurrsion over types
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
      nextEvents,
      childWorkflows: workflow.childWorkflowsRuntimeData?.map(childWorkflow =>
        this.formatWorkflow(childWorkflow, false),
      ),
    };
  }

  async persistChildEvent(childPluginConfig: ChildPluginCallbackOutput, projectIds: TProjectIds) {
    const childWorkflow = (
      await this.createOrUpdateWorkflowRuntime({
        workflowDefinitionId: childPluginConfig.definitionId,
        context: childPluginConfig.initOptions.context as unknown as DefaultContextSchema,
        parentWorkflowId: childPluginConfig.parentWorkflowRuntimeId,
        projectIds,
      })
    )[0];

    const parentWorkflowRuntime = await this.getWorkflowRuntimeDataById(
      childPluginConfig.parentWorkflowRuntimeId,
    );

    if (childWorkflow) {
      const contextToPersist = {
        [childWorkflow.workflowRuntimeData.id]: {
          entityId: childWorkflow.workflowRuntimeData.context.entity.id,
          status: childWorkflow.workflowRuntimeData.status || 'active',
        },
      };
      const parentContext = this.composeContextWithChildResponse(
        parentWorkflowRuntime.context,
        childWorkflow.workflowDefinition.id,
        contextToPersist,
      );

      await this.updateWorkflowRuntimeData(parentWorkflowRuntime.id, { context: parentContext });
    }

    return childWorkflow;
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
    projectIds,
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
    projectIds: TProjectIds;
  }) {
    const query = this.projectScopeService.scopeFindMany(
      merge(
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
              ? { endUserId: { not: null } }
              : { businessId: { not: null } },
        },
      ),
      projectIds,
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

  async listRuntimeData({
    page,
    size,
    status,
    orderBy,
    orderDirection,
  }: ListWorkflowsRuntimeParams): Promise<ListRuntimeDataResult> {
    const query = {
      where: {
        ...(status ? { status: { in: status } } : undefined),
      },
    };

    const [workflowsRuntimeCount, workflowsRuntime] = await Promise.all([
      this.workflowRuntimeDataRepository.count(query),
      this.workflowRuntimeDataRepository.findMany({
        ...query,
        skip: page && size ? (page - 1) * size : undefined,
        take: size,
        include: {
          workflowDefinition: true,
          assignee: true,
        },
        orderBy: this._resolveOrderByParams(orderBy, orderDirection),
      }),
    ]);

    const result: ListRuntimeDataResult = {
      results: this.workflowsRuntimeListItemsFactory(workflowsRuntime),
      meta: {
        pages: size ? Math.max(Math.ceil(workflowsRuntimeCount / size)) : 0,
        total: workflowsRuntimeCount,
      },
    };

    return result;
  }

  private _resolveOrderByParams(
    orderBy: string | undefined,
    orderDirection: SortOrder | undefined,
  ): object {
    if (!orderBy && !orderDirection) return {};

    if (orderBy === 'assignee') {
      return {
        assignee: {
          firstName: orderDirection,
        },
      };
    }

    if (orderBy === 'workflowDefinitionName') {
      return {
        workflowDefinition: {
          name: orderDirection,
        },
      };
    }

    return {
      [orderBy as string]: orderDirection,
    };
  }

  private workflowsRuntimeListItemsFactory(
    workflows: WorkflowRuntimeListQueryResult[],
  ): WorkflowRuntimeListItemModel[] {
    return workflows.map(workflow => {
      const { assignee, workflowDefinition } = workflow;

      return plainToClass(
        WorkflowRuntimeListItemModel,
        {
          ...workflow,
          assignee: assignee ? plainToClass(WorkflowAssignee, assignee) : null,
          workflowDefinitionName: workflowDefinition?.name || null,
        },
        { excludeExtraneousValues: true },
      );
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

  async updateDecisionAndSendEvent({
    id,
    name,
    reason,
    projectIds,
  }: {
    id: string;
    name: string;
    reason?: string;
    projectIds: TProjectIds;
  }) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(id);
    // `name` is always `approve` and not `approved` etc.
    const Status = {
      approve: 'approved',
      reject: 'rejected',
      revision: 'revision',
    } as const;
    const status = Status[name as keyof typeof Status];
    const decision = (() => {
      if (status === 'approved') {
        return {
          revisionReason: null,
          rejectionReason: null,
        };
      }

      if (status === 'rejected') {
        return {
          revisionReason: null,
          rejectionReason: reason,
        };
      }

      if (status === 'revision') {
        return {
          revisionReason: reason,
          rejectionReason: null,
        };
      }

      throw new BadRequestException(`Invalid decision status: ${status}`);
    })();
    const documentsWithDecision = runtimeData?.context?.documents?.map(
      (document: DefaultContextSchema['documents'][number]) => ({
        ...document,
        decision: {
          ...document?.decision,
          ...decision,
          status,
        },
      }),
    );
    const updatedWorkflow = await this.updateWorkflowRuntimeData(id, {
      context: {
        ...runtimeData?.context,
        documents: documentsWithDecision,
      },
    });

    await this.event(
      {
        id,
        name,
      },
      projectIds,
    );

    return updatedWorkflow;
  }

  async updateDocumentDecisionById(
    {
      workflowId,
      documentId,
    }: {
      workflowId: string;
      documentId: string;
    },
    decision: {
      status: 'approve' | 'reject' | 'revision';
      reason?: string;
    },
  ) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(workflowId);
    // `name` is always `approve` and not `approved` etc.
    const Status = {
      approve: 'approved',
      reject: 'rejected',
      revision: 'revision',
    } as const;
    const status = Status[decision?.status];
    const newDecision = (() => {
      if (status === 'approved') {
        return {
          revisionReason: null,
          rejectionReason: null,
        };
      }

      if (status === 'rejected') {
        return {
          revisionReason: null,
          rejectionReason: decision?.reason,
        };
      }

      if (status === 'revision') {
        return {
          revisionReason: decision?.reason,
          rejectionReason: null,
        };
      }

      throw new BadRequestException(`Invalid decision status: ${status}`);
    })();
    const documentsWithDecision = runtimeData?.context?.documents?.map(
      (document: DefaultContextSchema['documents'][number]) => {
        if (document.id !== documentId) return document;

        return {
          id: document.id,
          decision: {
            ...newDecision,
            status,
          },
        };
      },
    );
    const updatedWorkflow = await this.updateContextById(workflowId, {
      documents: documentsWithDecision,
    });

    const correlationId = await this.getCorrelationIdFromWorkflow(updatedWorkflow);

    this.workflowEventEmitter.emit('workflow.context.changed', {
      oldRuntimeData: runtimeData,
      updatedRuntimeData: updatedWorkflow,
      state: updatedWorkflow.state,
      entityId: (updatedWorkflow.businessId || updatedWorkflow.endUserId) as string,
      correlationId: correlationId,
    });

    return updatedWorkflow;
  }

  async updateContextById(id: string, context: WorkflowRuntimeData['context']) {
    return this.workflowRuntimeDataRepository.updateContextById(id, context);
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
    // TODO: Use snapshot.done instead
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

      this.workflowEventEmitter.emit('workflow.completed', {
        runtimeData,
        state: currentState ?? runtimeData.state,
        entityId: runtimeData.businessId || runtimeData.endUserId,
        correlationId,
      });
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
          resolvedAt: isResolved ? new Date().toISOString() : null,
        },
      });
    } else {
      updatedResult = await this.workflowRuntimeDataRepository.updateById(workflowRuntimeId, {
        data: {
          ...data,
          resolvedAt: isResolved ? new Date().toISOString() : null,
        },
      });
    }

    if (contextHasChanged) {
      this.workflowEventEmitter.emit('workflow.context.changed', {
        oldRuntimeData: runtimeData,
        updatedRuntimeData: updatedResult,
        state: currentState as string,
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
    const workflowRuntimeData = await this.workflowRuntimeDataRepository.findById(
      workflowRuntimeId,
    );
    const hasDecision =
      workflowRuntimeData?.context?.documents?.length &&
      workflowRuntimeData?.context?.documents?.every(
        (document: DefaultContextSchema['documents'][number]) => !!document?.decision?.status,
      );

    if (hasDecision) {
      throw new BadRequestException(
        `Workflow with the id of "${workflowRuntimeId}" already has a decision`,
      );
    }

    const updatedWorkflowRuntimeData = await this.workflowRuntimeDataRepository.updateById(
      workflowRuntimeId,
      { data: { assigneeId: assigneeId, assignedAt: new Date() } },
    );

    return updatedWorkflowRuntimeData;
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
    projectIds: TProjectIds,
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
      if (manualReviewWorkflow.state === 'revision') {
        await this.event(
          {
            name: 'review',
            id: manualReviewWorkflow.id,
          },
          projectIds,
        );
      }

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
    projectIds: TProjectIds,
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
    return this.createOrUpdateWorkflowRuntime({ workflowDefinitionId, context, projectIds });
  }

  async createOrUpdateWorkflowRuntime({
    workflowDefinitionId,
    context,
    config,
    parentWorkflowId,
    projectIds,
  }: {
    workflowDefinitionId: string;
    context: DefaultContextSchema;
    config?: WorkflowConfig;
    parentWorkflowId?: string;
    projectIds: TProjectIds;
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
    const entityId = await this.__findOrPersistEntityInformation(context, projectIds);
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
      contextToInsert = await this.copyFileAndCreate(contextToInsert, entityId, projectIds);
      workflowRuntimeData = await this.workflowRuntimeDataRepository.create(
        this.projectScopeService.scopeCreate(
          {
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
              ...(parentWorkflowId && {
                parentWorkflowRuntimeData: { connect: { id: parentWorkflowId } },
              }),
            },
          },
          projectIds,
        ),
      );
      newWorkflowCreated = true;
    } else {
      contextToInsert.documents = updateDocuments(
        existingWorkflowRuntimeData.context.documents,
        context.documents,
      );

      contextToInsert = await this.copyFileAndCreate(contextToInsert, entityId, projectIds);
      workflowRuntimeData = await this.workflowRuntimeDataRepository.updateById(
        existingWorkflowRuntimeData.id,
        this.projectScopeService.scopeUpdate(
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
          projectIds,
        ),
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

  async copyFileAndCreate(
    context: DefaultContextSchema,
    entityId: TEntityId,
    projectIds: TProjectIds,
  ): Promise<DefaultContextSchema> {
    if (!context?.documents?.length) return context;

    const documentsWithPersistedImages = await Promise.all(
      context?.documents?.map(async document => ({
        ...document,
        pages: await this.__persistDocumentPagesFiles(document, entityId, projectIds),
      })),
    );

    return { ...context, documents: documentsWithPersistedImages };
  }
  private async __persistDocumentPagesFiles(
    document: DefaultContextSchema['documents'][number],
    entityId: string,
    projectIds: TProjectIds,
  ) {
    return await Promise.all(
      document?.pages?.map(async documentPage => {
        const ballerineFileId =
          documentPage.ballerineFileId ||
          (await this.__copyFileToDestinationAndCraeteFile(
            document,
            entityId,
            documentPage,
            projectIds,
          ));

        return { ...documentPage, ballerineFileId };
      }),
    );
  }

  private async __copyFileToDestinationAndCraeteFile(
    document: DefaultContextSchema['documents'][number],
    entityId: string,
    documentPage: TDefaultSchemaDocumentPage,
    projectIds: TProjectIds,
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
      projectIds,
    });

    return ballerineFileId;
  }

  private async __findOrPersistEntityInformation(
    context: DefaultContextSchema,
    projectIds: TProjectIds,
  ) {
    const { entity } = context;
    const entityId = await this.__tryToFetchExistingEntityId(entity);

    if (entityId) {
      return entityId;
    }

    if (!entity.data) {
      throw new BadRequestException('Entity data is required');
    }

    if (entity.type === 'individual') {
      return await this.__persistEndUserInfo(entity, context, projectIds);
    } else {
      return await this.__persistBusinessInformation(entity, context, projectIds);
    }
  }

  private async __persistEndUserInfo(
    entity: { [p: string]: unknown },
    context: DefaultContextSchema,
    projectIds: TProjectIds,
  ) {
    const { id } = await this.endUserRepository.create(
      this.projectScopeService.scopeCreate(
        {
          data: {
            correlationId: entity.id,
            ...(context.entity.data as object),
          } as Prisma.EndUserCreateInput,
        },
        projectIds,
      ),
    );
    return id;
  }

  private async __persistBusinessInformation(
    entity: { [p: string]: unknown },
    context: DefaultContextSchema,
    projectIds: TProjectIds,
  ) {
    const { id } = await this.businessRepository.create(
      this.projectScopeService.scopeCreate(
        {
          data: {
            correlationId: entity.id,
            ...(context.entity.data as object),
          } as Prisma.BusinessCreateInput,
        },
        projectIds,
      ),
    );

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

    const validate = ajv.compile(workflowDefinition?.contextSchema?.schema); // TODO: fix type
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

  async event({ name: type, id }: WorkflowEventInput & IObjectWithId, projectIds: TProjectIds) {
    this.logger.log('Workflow event received', { id, type });
    const workflowRuntimeData = await this.workflowRuntimeDataRepository.findById(id);
    const workflowDefinition = await this.workflowDefinitionRepository.findById(
      workflowRuntimeData.workflowDefinitionId,
    );

    const service = createWorkflow({
      runtimeId: workflowRuntimeData.id,
      definition: workflowDefinition.definition,
      definitionType: workflowDefinition.definitionType,
      workflowContext: {
        machineContext: workflowRuntimeData.context,
        state: workflowRuntimeData.state,
      },
      extensions: workflowDefinition.extensions,
      invokeChildWorkflowAction: async (childPluginConfiguration: ChildPluginCallbackOutput) => {
        const runnableChildWorkflow = await this.persistChildEvent(
          childPluginConfiguration,
          projectIds,
        );

        if (runnableChildWorkflow && childPluginConfiguration.initOptions.event) {
          // TODO: Review the issue if return child workflow id for parent and not "send event"
          await this.event(
            {
              id: runnableChildWorkflow.workflowRuntimeData.id,
              name: childPluginConfiguration.initOptions.event,
            },
            projectIds,
          );
        }
      },
    });

    await service.sendEvent({
      type,
    });

    const snapshot = service.getSnapshot();
    const currentState = snapshot.value;
    const context = snapshot.machine.context;
    // TODO: Refactor to use snapshot.done instead
    const isFinal = snapshot.machine.states[currentState].type === 'final';
    const entityType = aliasIndividualAsEndUser(context?.entity?.type);
    const entityId = workflowRuntimeData[`${entityType}Id`];

    this.logger.log('Workflow state transition', {
      id: id,
      from: workflowRuntimeData.state,
      to: currentState,
    });
    const updatedRuntimeData = await this.updateWorkflowRuntimeData(workflowRuntimeData.id, {
      context,
      state: currentState,
      status: isFinal ? 'completed' : workflowRuntimeData.status,
    });

    if (workflowRuntimeData.parentRuntimeDataId) {
      await this.persistChildWorkflowToParent(
        workflowRuntimeData,
        workflowDefinition,
        isFinal,
        projectIds,
        currentState,
      );
    }

    this.workflowEventEmitter.emit('workflow.state.changed', {
      entityId,
      state: updatedRuntimeData.state,
      correlationId: updatedRuntimeData.correlationId,
      runtimeData: updatedRuntimeData,
    });

    if (!isFinal || (currentState !== 'approved' && currentState !== 'rejected')) {
      return;
    }

    const approvalState = ApprovalState[currentState.toUpperCase() as keyof typeof ApprovalState];

    if (!entityType) {
      throw new BadRequestException(`entity.type is required`);
    }

    if (!entityId) {
      throw new BadRequestException(`entity.${entityType}Id is required`);
    }

    if (entityType === 'endUser') {
      await this.entityRepository[entityType].updateById(entityId, {
        data: {
          approvalState,
        },
      });
    }

    if (entityType === 'business') {
      await this.entityRepository[entityType].updateById(entityId, {
        data: {
          approvalState,
        },
      });
    }
  }

  async persistChildWorkflowToParent(
    workflowRuntimeData: WorkflowRuntimeData,
    workflowDefinition: WorkflowDefinition,
    isFinal: boolean,
    projectIds: TProjectIds,
    childRuntimeState?: string,
  ) {
    const parentWorkflowRuntime = await this.getWorkflowRuntimeWithChildrenDataById(
      workflowRuntimeData.parentRuntimeDataId,
      { include: { childWorkflowsRuntimeData: true } },
    );
    const parentWorkflowDefinition = await this.getWorkflowDefinitionById(
      parentWorkflowRuntime.workflowDefinitionId,
    );

    const callbackTransformation = (
      parentWorkflowDefinition?.config
        ?.childCallbackResults as ChildToParentCallback['childCallbackResults']
    )
      // @ts-ignore - fix as childCallbackResults[number]
      ?.find(childCallbackResult => workflowDefinition.id === childCallbackResult.definitionId);
    const childWorkflowCallback = (callbackTransformation ||
      workflowDefinition.config.callbackResult!) as ChildWorkflowCallback;
    const childrenOfSameDefinition = (
      parentWorkflowRuntime.childWorkflowsRuntimeData as Array<WorkflowRuntimeData>
    )?.filter(
      childWorkflow =>
        childWorkflow.workflowDefinitionId === workflowRuntimeData.workflowDefinitionId,
    );
    const isPersistableState =
      !!(
        childRuntimeState &&
        childWorkflowCallback.persistenceStates &&
        childWorkflowCallback.persistenceStates.includes(childRuntimeState)
      ) || isFinal;
    if (!isPersistableState) return;

    const parentContext = await this.generateParentContextWithInjectedChildContext(
      childrenOfSameDefinition,
      childWorkflowCallback.transformers,
      parentWorkflowRuntime,
      workflowDefinition,
      isPersistableState,
    );

    await this.updateWorkflowRuntimeData(parentWorkflowRuntime.id, { context: parentContext });

    if (
      childWorkflowCallback.deliverEvent &&
      parentWorkflowRuntime.status !== 'completed' &&
      isPersistableState
    ) {
      await this.event(
        {
          id: parentWorkflowRuntime.id,
          name: childWorkflowCallback.deliverEvent,
        },
        projectIds,
      );
    }
  }

  private async generateParentContextWithInjectedChildContext(
    childrenOfSameDefinition: WorkflowRuntimeData[],
    transformers: ChildWorkflowCallback['transformers'],
    parentWorkflowRuntime: WorkflowRuntimeData,
    workflowDefinition: WorkflowDefinition,
    isPersistableToParent: boolean,
  ) {
    if (!isPersistableToParent)
      return this.composeContextWithChildResponse(
        parentWorkflowRuntime.context,
        workflowDefinition.id,
      );

    const transformerInstance = (transformers || []).map((transformer: SerializableTransformer) =>
      this.initiateTransformer(transformer),
    );

    const contextToPersist: Record<string, any> = {};

    for (const childWorkflow of childrenOfSameDefinition) {
      let childContextToPersist = childWorkflow.context;

      for (const transformer of transformerInstance || []) {
        childContextToPersist = await transformer.transform(childContextToPersist);
      }
      contextToPersist[childWorkflow.id] = {
        entityId: childWorkflow.context.entity.id,
        status: childContextToPersist.status,
        result: childContextToPersist,
      };
    }

    const parentContext = this.composeContextWithChildResponse(
      parentWorkflowRuntime.context,
      workflowDefinition.id,
      contextToPersist,
    );

    return parentContext;
  }

  private initiateTransformer(transformer: SerializableTransformer): Transformer {
    if (transformer.transformer === 'jmespath')
      return new JmespathTransformer(transformer.mapping as string);
    if (transformer.transformer === 'helper')
      return new HelpersTransformer(transformer.mapping as THelperFormatingLogic);

    throw new Error(`No transformer found for ${transformer.transformer}`);
  }

  private composeContextWithChildResponse(
    parentWorkflowContext: any,
    definitionId: string,
    contextToPersist?: any,
  ) {
    parentWorkflowContext['childWorkflows'] ||= {};
    parentWorkflowContext['childWorkflows'][definitionId] ||= {};

    parentWorkflowContext['childWorkflows'][definitionId] = contextToPersist;
    return parentWorkflowContext;
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
    const bucketName = AwsS3FileConfig.getBucketName(processEnv);

    if (isThrowOnMissing && !bucketName) {
      throw new Error(`S3 Bucket name is not set`);
    }

    return bucketName;
  }

  async getWorkflowRuntimeDataContext(id: string) {
    return this.workflowRuntimeDataRepository.findContext(id);
  }

  async getLastActiveFlow({
    email,
    workflowRuntimeDefinitionId,
    projectIds,
  }: GetLastActiveFlowParams): Promise<WorkflowRuntimeData | null> {
    const endUser = await this.endUserService.getByEmail(email, projectIds);

    if (!endUser || !endUser.businesses.length) return null;

    const query = {
      endUserId: endUser.id,
      ...{
        workflowDefinitionId: workflowRuntimeDefinitionId,
        businessId: endUser.businesses.at(-1)!.id,
      },
      projectIds,
    };

    this.logger.log(`Getting last active workflow`, query);

    const workflowData = await this.workflowRuntimeDataRepository.findLastActive(query);

    this.logger.log('Last active workflow', { workflowId: workflowData ? workflowData.id : null });

    return workflowData ? workflowData : null;
  }
}
