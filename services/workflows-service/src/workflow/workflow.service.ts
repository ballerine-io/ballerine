import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { BusinessRepository } from '@/business/business.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { SortOrder } from '@/common/query-filters/sort-order';
import { TDocumentsWithoutPageType, TDocumentWithoutPageType } from '@/common/types';
import { aliasIndividualAsEndUser } from '@/common/utils/alias-individual-as-end-user/alias-individual-as-end-user';
import { logDocumentWithoutId } from '@/common/utils/log-document-without-id/log-document-without-id';
import { CustomerService } from '@/customer/customer.service';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { FileService } from '@/providers/file/file.service';
import { SalesforceService } from '@/salesforce/salesforce.service';
import type { InputJsonValue, IObjectWithId, TProjectId, TProjectIds } from '@/types';
import { UserService } from '@/user/user.service';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';
import { WorkflowAssigneeId } from '@/workflow/dtos/workflow-assignee-id';
import { WorkflowDefinitionCloneDto } from '@/workflow/dtos/workflow-definition-clone';
import { GetLastActiveFlowParams } from '@/workflow/types/params';
import { toPrismaOrderBy } from '@/workflow/utils/toPrismaOrderBy';
import { toPrismaWhere } from '@/workflow/utils/toPrismaWhere';
import {
  WorkflowAssignee,
  WorkflowRuntimeListItemModel,
} from '@/workflow/workflow-runtime-list-item.model';
import {
  AnyRecord,
  DefaultContextSchema,
  getDocumentId,
  isErrorWithMessage,
} from '@ballerine/common';
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
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApprovalState,
  Business,
  EndUser,
  Prisma,
  WorkflowDefinition,
  WorkflowRuntimeData,
  WorkflowRuntimeDataStatus,
} from '@prisma/client';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { plainToClass } from 'class-transformer';
import { isEqual, merge } from 'lodash';
import { WorkflowDefinitionCreateDto } from './dtos/workflow-definition-create';
import { WorkflowDefinitionFindManyArgs } from './dtos/workflow-definition-find-many-args';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { ConfigSchema, WorkflowConfig } from './schemas/zod-schemas';
import {
  ListRuntimeDataResult,
  ListWorkflowsRuntimeParams,
  TWorkflowWithRelations,
  WorkflowRuntimeListQueryResult,
} from './types';
import { addPropertiesSchemaToDocument } from './utils/add-properties-schema-to-document';
import { WorkflowDefinitionRepository } from '../workflow-defintion/workflow-definition.repository';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import {
  ArrayMergeOption,
  WorkflowRuntimeDataRepository,
} from './workflow-runtime-data.repository';
import mime from 'mime';
import { env } from '@/env';
import { AjvValidationError } from '@/errors';

type TEntityId = string;

const ajv = new Ajv({
  strict: false,
  coerceTypes: true,
});
addFormats(ajv, {
  formats: ['email', 'uri', 'date', 'date-time'],
  keywords: true,
});
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
    protected readonly customerService: CustomerService,
    protected readonly fileService: FileService,
    protected readonly workflowEventEmitter: WorkflowEventEmitterService,
    private readonly logger: AppLoggerService,
    private readonly projectScopeService: ProjectScopeService,
    private readonly userService: UserService,
    private readonly salesforceService: SalesforceService,
    private readonly workflowTokenService: WorkflowTokenService,
  ) {}

  async createWorkflowDefinition(data: WorkflowDefinitionCreateDto, projectId: TProjectId) {
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

    if (data.isPublic) {
      return await this.workflowDefinitionRepository.createUnscoped({ data, select });
    }

    return await this.workflowDefinitionRepository.create({ data, select });
  }

  async cloneWorkflowDefinition(data: WorkflowDefinitionCloneDto, projectId: string) {
    const select = {
      reviewMachineId: true,
      name: true,
      version: true,
      definitionType: true,
      definition: true,
      contextSchema: true,
      config: true,
      supportedPlatforms: true,
      extensions: true,
      backend: true,
      persistStates: true,
      submitStates: true,
    };

    const workflowDefinition = await this.workflowDefinitionRepository.findTemplateByIdUnscoped(
      data.id,
      { select },
    );

    return await this.workflowDefinitionRepository.create({
      // @ts-expect-error - types of workflow definition does not propagate to the prisma creation type
      data: { ...workflowDefinition, name: data.name, projectId: projectId, isPublic: false },
      select,
    });
  }

  async getWorkflowRuntimeDataById(
    id: string,
    args: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.workflowRuntimeDataRepository.findById(id, args, projectIds);
  }

  async getWorkflowRuntimeDataByIdUnscoped(workflowRuntimeDataId: string) {
    return await this.workflowRuntimeDataRepository.findByIdUnscoped(workflowRuntimeDataId);
  }

  async getWorkflowRuntimeWithChildrenDataById(
    id: string,
    args: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.workflowRuntimeDataRepository.findById(
      id,
      {
        ...args,
      },
      projectIds,
    );
  }

  async getWorkflowByIdWithRelations(
    id: string,
    args: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    const allEntities = { endUser: true, business: true };
    const childWorkflowSelectArgs = {
      select: { ...args?.select, ...allEntities },
      include: args?.include,
    };
    const workflow = (await this.workflowRuntimeDataRepository.findById(
      id,
      {
        ...args,
        select: {
          ...(args?.select || {}),
          childWorkflowsRuntimeData: { ...childWorkflowSelectArgs },
        },
      },
      projectIds,
    )) as TWorkflowWithRelations;

    return this.formatWorkflow(workflow);
  }

  private formatWorkflow(
    workflow: TWorkflowWithRelations,
    addNextEvents = true,
  ): TWorkflowWithRelations {
    const getEntity = (workflow: TWorkflowWithRelations) => {
      if ('endUser' in workflow && !!workflow?.endUser) {
        return {
          id: workflow?.endUser?.id,
          name: `${String(workflow?.endUser?.firstName)} ${String(workflow?.endUser?.lastName)}`,
          avatarUrl: workflow?.endUser?.avatarUrl,
          approvalState: workflow?.endUser?.approvalState,
        };
      }

      if ('business' in workflow && workflow?.business) {
        return {
          id: workflow?.business?.id,
          name: workflow?.business?.companyName,
          avatarUrl: null,
          approvalState: workflow?.business?.approvalState,
        };
      }

      throw new InternalServerErrorException('Workflow entity is not defined');
    };

    let nextEvents;
    if (addNextEvents) {
      const service = createWorkflow({
        runtimeId: workflow.id,
        // @ts-expect-error - error from Prisma types fix
        definition: workflow.workflowDefinition.definition,
        // Might want to change to type string in `createWorkflow` or add a type for `workflowDefinition` of 'statechart-json' | 'bpmn-json'
        definitionType: workflow.workflowDefinition.definitionType as 'statechart-json',
        workflowContext: {
          machineContext: workflow.context,
          // @ts-expect-error - error from Prisma types fix
          state: workflow.state ?? workflow.workflowDefinition.definition?.initial,
        },
      });

      nextEvents = service.getSnapshot().nextEvents;
    }

    return {
      ...workflow,
      context: {
        ...workflow.context,
        documents: workflow.context?.documents?.map(
          (document: DefaultContextSchema['documents'][number]) => {
            return addPropertiesSchemaToDocument(
              document,
              workflow.workflowDefinition.documentsSchema,
            );
          },
        ),
      },
      entity: getEntity(workflow),
      endUser: undefined,
      // @ts-expect-error - error from Prisma types fix
      business: undefined,
      nextEvents,
      childWorkflows: workflow.childWorkflowsRuntimeData?.map(childWorkflow =>
        this.formatWorkflow(childWorkflow),
      ),
    };
  }

  async persistChildEvent(
    childPluginConfig: ChildPluginCallbackOutput,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
  ) {
    const childWorkflow = (
      await this.createOrUpdateWorkflowRuntime({
        workflowDefinitionId: childPluginConfig.definitionId,
        context: childPluginConfig.initOptions.context as unknown as DefaultContextSchema,
        config: childPluginConfig.initOptions.config as unknown as AnyRecord,
        parentWorkflowId: childPluginConfig.parentWorkflowRuntimeId,
        projectIds,
        currentProjectId,
      })
    )[0];

    const parentWorkflowRuntime = await this.getWorkflowRuntimeDataById(
      childPluginConfig.parentWorkflowRuntimeId,
      {},
      projectIds,
    );

    if (childWorkflow) {
      const contextToPersist = {
        [childWorkflow.workflowRuntimeData.id]: {
          entityId: childWorkflow.workflowRuntimeData.context.entity.id,
          status: childWorkflow.workflowRuntimeData.status || 'active',
          state: childWorkflow.workflowRuntimeData.state,
        },
      };
      const parentContext = this.composeContextWithChildResponse(
        parentWorkflowRuntime.context,
        childWorkflow.workflowDefinition.id,
        contextToPersist,
      );

      await this.updateWorkflowRuntimeData(
        parentWorkflowRuntime.id,
        { context: parentContext },
        currentProjectId,
      );
    }

    return childWorkflow;
  }

  async getWorkflowRuntimeDataByCorrelationId(
    id: string,
    args: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.workflowRuntimeDataRepository.findById(id, args, projectIds);
  }

  async getWorkflowDefinitionById(
    id: string,
    args: Parameters<WorkflowDefinitionRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.workflowDefinitionRepository.findById(id, args, projectIds);
  }

  async listActiveWorkflowsRuntimeStates(projectIds: TProjectIds) {
    return await this.workflowRuntimeDataRepository.findMany(
      {
        select: {
          state: true,
          endUserId: true,
          businessId: true,
          assigneeId: true,
          id: true,
          status: true,
          workflowDefinitionId: true,
        },
      },
      projectIds,
    );
  }

  async listWorkflowRuntimeDataWithRelations(
    {
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
    },
    projectIds: TProjectIds,
  ) {
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

    const totalWorkflowsCount = await this.workflowRuntimeDataRepository.count(
      {
        where: query.where,
      },
      projectIds,
    );

    if (page.number > 1 && totalWorkflowsCount < (page.number - 1) * page.size + 1) {
      throw new NotFoundException('Page not found');
    }

    const workflows = await this.workflowRuntimeDataRepository.findMany(query, projectIds);

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
              avatarUrl: workflow?.assignee?.avatarUrl,
            }
          : null,
        tags: workflow?.tags,
      };
    });
  }

  async listWorkflowRuntimeDataByUserId(userId: string, projectIds: TProjectIds) {
    return await this.workflowRuntimeDataRepository.findMany(
      {
        where: { endUserId: userId },
      },
      projectIds,
    );
  }

  async listFullWorkflowDataByUserId(
    {
      entityId,
      entity,
    }: {
      entityId: string;
      entity: TEntityType;
    },
    projectIds: TProjectIds,
  ) {
    return await this.workflowRuntimeDataRepository.findMany(
      {
        where: {
          [`${entity}Id`]: entityId,
        },
        include: { workflowDefinition: true },
      },
      projectIds,
    );
  }

  async listRuntimeData(
    { page, size, status, orderBy, orderDirection }: ListWorkflowsRuntimeParams,
    projectIds: TProjectIds,
  ): Promise<ListRuntimeDataResult> {
    const query = {
      where: {
        ...(status ? { status: { in: status } } : undefined),
        ...(projectIds ? { projectId: { in: projectIds } } : undefined),
      },
    };

    const [workflowsRuntimeCount, workflowsRuntime] = await Promise.all([
      this.workflowRuntimeDataRepository.count(query, projectIds),
      this.workflowRuntimeDataRepository.findMany(
        {
          ...query,
          skip: page && size ? (page - 1) * size : undefined,
          take: size,
          include: {
            workflowDefinition: true,
            assignee: true,
          },
          orderBy: this._resolveOrderByParams(orderBy, orderDirection),
        },
        projectIds,
      ),
    ]);

    const result: ListRuntimeDataResult = {
      results: this.workflowsRuntimeListItemsFactory(
        workflowsRuntime as unknown as WorkflowRuntimeListQueryResult[],
      ),
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

  async listWorkflowDefinitions(args: WorkflowDefinitionFindManyArgs, projectIds: TProjectIds) {
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
    return await this.workflowDefinitionRepository.findMany({ ...args, select }, projectIds);
  }

  async updateDecisionAndSendEvent({
    id,
    name,
    reason,
    projectId,
  }: {
    id: string;
    name: string;
    reason?: string;
    projectId: TProjectId;
  }) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(
      id,
      {},
      projectId ? [projectId] : null,
    );
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
    const updatedWorkflow = await this.updateWorkflowRuntimeData(
      id,
      {
        context: {
          ...runtimeData?.context,
          documents: documentsWithDecision,
        },
      },
      projectId,
    );

    await this.event(
      {
        id,
        name,
      },
      projectId ? [projectId] : null,
      projectId,
    );

    return updatedWorkflow;
  }

  async updateDocumentDecisionById(
    {
      workflowId,
      documentId,
      documentsUpdateContextMethod,
    }: {
      workflowId: string;
      documentId: string;
      documentsUpdateContextMethod?: 'base' | 'director';
    },
    decision: {
      status: 'approve' | 'reject' | 'revision' | 'revised' | null;
      reason?: string;
    },
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
    postUpdateEventName?: string,
  ) {
    const workflow = await this.workflowRuntimeDataRepository.findById(workflowId, {}, projectIds);
    const workflowDefinition = await this.workflowDefinitionRepository.findById(
      workflow?.workflowDefinitionId,
      {},
      projectIds,
    );
    // `name` is always `approve` and not `approved` etc.
    const Status = {
      approve: 'approved',
      reject: 'rejected',
      revision: 'revision',
      revised: 'revised',
    } as const;
    const status = decision.status ? Status[decision.status] : null;
    const newDecision = (() => {
      if (!status || status === 'approved') {
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

      if (['revision', 'revised'].includes(status)) {
        return {
          revisionReason: decision?.reason,
          rejectionReason: null,
        };
      }

      throw new BadRequestException(`Invalid decision status: ${status}`);
    })();

    const documents = this.getDocuments(workflow.context, documentsUpdateContextMethod);
    let document = documents.find((document: any) => document.id === documentId);
    const updatedStatus =
      (documentId === document.id ? status : document?.decision?.status) ?? undefined;

    const updatedContext = this.updateDocumentInContext(
      workflow.context,
      {
        ...document,
        decision: {
          ...document?.decision,
          status: updatedStatus,
        },
        type:
          document?.type === 'unknown' && updatedStatus === 'approved' ? undefined : document?.type,
      },
      documentsUpdateContextMethod,
    );

    document = this.getDocuments(updatedContext, documentsUpdateContextMethod)?.find(
      (document: any) => document.id === documentId,
    );

    this.__validateWorkflowDefinitionContext(workflowDefinition, updatedContext);

    const documentWithDecision = {
      ...document,
      id: document.id,
      decision: {
        ...newDecision,
        status,
      },
    };
    const checkRequiredFields = status === 'approved';

    const updatedWorkflow = await this.updateDocumentById(
      {
        workflowId,
        documentId,
        checkRequiredFields,
        documentsUpdateContextMethod: documentsUpdateContextMethod,
      },
      documentWithDecision as unknown as DefaultContextSchema['documents'][number],
      projectIds![0]!,
    );

    logDocumentWithoutId({
      line: 'updateDocumentDecisionById 770',
      logger: this.logger,
      workflowRuntimeData: updatedWorkflow,
    });

    if (postUpdateEventName) {
      return await this.event(
        { id: workflowId, name: postUpdateEventName },
        projectIds,
        currentProjectId,
      );
    }

    return updatedWorkflow;
  }

  async updateDocumentById(
    {
      workflowId,
      documentId,
      checkRequiredFields = true,
      documentsUpdateContextMethod,
    }: {
      workflowId: string;
      documentId: string;
      checkRequiredFields?: boolean;
      documentsUpdateContextMethod?: 'base' | 'director';
    },
    data: DefaultContextSchema['documents'][number] & { propertiesSchema?: object },
    projectId: TProjectId,
  ) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(workflowId, {}, [
      projectId,
    ]);
    const workflowDef = await this.workflowDefinitionRepository.findById(
      runtimeData.workflowDefinitionId,
      {},
      [projectId],
    );

    const document = {
      ...data,
      id: documentId,
    };

    const documentSchema = addPropertiesSchemaToDocument(document, workflowDef.documentsSchema);
    const propertiesSchema = documentSchema?.propertiesSchema ?? {};
    if (Object.keys(propertiesSchema)?.length) {
      let propertiesSchemaForValidation = propertiesSchema;
      if (!checkRequiredFields) {
        const { required: _required, ..._propertiesSchemaForValidation } = propertiesSchema;
        propertiesSchemaForValidation = _propertiesSchemaForValidation;
      }
      const validatePropertiesSchema = ajv.compile(propertiesSchemaForValidation);

      const isValidPropertiesSchema = validatePropertiesSchema(documentSchema?.properties);

      if (!isValidPropertiesSchema) {
        throw new AjvValidationError(validatePropertiesSchema.errors);
      }
    }

    const updatedWorkflow = await this.updateContextById(
      workflowId,
      this.updateDocumentInContext(
        runtimeData.context,
        documentSchema,
        documentsUpdateContextMethod,
      ),
      [projectId],
      documentsUpdateContextMethod === 'director' ? 'by_index' : 'by_id',
    );

    const updatedDocuments = this.getDocuments(
      updatedWorkflow.context,
      documentsUpdateContextMethod,
    );

    logDocumentWithoutId({
      line: 'updateDocumentDecisionById 844',
      logger: this.logger,
      workflowRuntimeData: updatedWorkflow,
    });

    this.__validateWorkflowDefinitionContext(workflowDef, updatedWorkflow.context);
    const correlationId = await this.getCorrelationIdFromWorkflow(updatedWorkflow, [projectId]);

    if (
      ['active'].includes(updatedWorkflow.status) &&
      workflowDef.config?.completedWhenTasksResolved
    ) {
      const allDocumentsResolved =
        updatedDocuments?.length &&
        updatedDocuments?.every((document: DefaultContextSchema['documents'][number]) => {
          return ['approved', 'rejected', 'revision'].includes(
            document?.decision?.status as string,
          );
        });

      if (allDocumentsResolved) {
        updatedWorkflow.status = allDocumentsResolved ? 'completed' : updatedWorkflow.status;
        await this.workflowRuntimeDataRepository.updateById(workflowId, {
          data: {
            status: updatedWorkflow.status,
            resolvedAt: new Date().toISOString(),
            projectId,
          },
        });

        this.workflowEventEmitter.emit('workflow.completed', {
          runtimeData: updatedWorkflow,
          state: updatedWorkflow.state,
          //@ts-expect-error
          entityId: updatedWorkflow.businessId || updatedWorkflow.endUserId,
          correlationId,
        });
      }
    }

    return updatedWorkflow;
  }

  private updateDocumentInContext(
    context: WorkflowRuntimeData['context'],
    updatePayload: any,
    method: 'base' | 'director' = 'base',
  ): WorkflowRuntimeData['context'] {
    switch (method) {
      case 'base':
        return {
          ...context,
          documents: [updatePayload],
        };

      case 'director':
        return this.updateDirectorDocument(context, updatePayload);

      default:
        return context;
    }
  }

  private getDocuments(
    context: WorkflowRuntimeData['context'],
    documentsUpdateContextMethod: 'base' | 'director' = 'base',
  ) {
    switch (documentsUpdateContextMethod) {
      case 'base':
        return context.documents;
      case 'director':
        return this.getDirectorsDocuments(context);
      default:
        'base';
    }
  }

  private updateDirectorDocument(
    context: WorkflowRuntimeData['context'],
    documentUpdatePayload: any,
  ): WorkflowRuntimeData['context'] {
    const directorsDocuments = this.getDirectorsDocuments(context);

    directorsDocuments.forEach(document => {
      if (document?.id === documentUpdatePayload?.id) {
        Object.entries(documentUpdatePayload).forEach(([key, value]) => {
          document[key] = value;
        });
      }
    });

    return context;
  }

  private getDirectorsDocuments(context: WorkflowRuntimeData['context']): any[] {
    return (
      this.getDirectors(context)
        .map(director => director.additionalInfo?.documents)
        .filter(Boolean)
        .flat() || ([] as any[])
    );
  }

  private getDirectors(context: WorkflowRuntimeData['context']): any[] {
    return (context?.entity?.data?.additionalInfo?.directors as any[]) || [];
  }

  async updateContextById(
    id: string,
    context: WorkflowRuntimeData['context'],
    projectIds: TProjectIds,
    mergeBy: ArrayMergeOption = 'by_id',
  ) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(id, {}, projectIds);
    const correlationId = await this.getCorrelationIdFromWorkflow(runtimeData, projectIds);
    const updatedRuntimeData = await this.workflowRuntimeDataRepository.updateContextById(
      id,
      context,
      mergeBy,
      projectIds,
    );

    this.workflowEventEmitter.emit('workflow.context.changed', {
      oldRuntimeData: runtimeData,
      updatedRuntimeData: updatedRuntimeData,
      state: updatedRuntimeData.state as string,
      entityId: (updatedRuntimeData.businessId || updatedRuntimeData.endUserId) as string,
      correlationId: correlationId,
    });

    return updatedRuntimeData;
  }

  async syncContextById(
    id: string,
    context: WorkflowRuntimeData['context'],
    projectId: TProjectId,
  ) {
    return this.workflowRuntimeDataRepository.updateById(id, { data: { context, projectId } });
  }

  async updateWorkflowRuntimeData(
    workflowRuntimeId: string,
    data: WorkflowDefinitionUpdateInput,
    projectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    const projectIds: TProjectIds = projectId ? [projectId] : null;

    const runtimeData = await this.workflowRuntimeDataRepository.findById(
      workflowRuntimeId,
      {},
      projectIds,
    );
    const workflowDef = await this.workflowDefinitionRepository.findById(
      runtimeData.workflowDefinitionId,
      {},
      projectIds,
    );

    const correlationId: string = await this.getCorrelationIdFromWorkflow(runtimeData, projectIds);

    let contextHasChanged, mergedContext;
    if (data.context) {
      data.context.documents = assignIdToDocuments(data.context.documents);
      contextHasChanged = !isEqual(data.context, runtimeData.context);
      mergedContext = merge({}, runtimeData.context, data.context);

      this.__validateWorkflowDefinitionContext(workflowDef, {
        ...mergedContext,
        documents: mergedContext?.documents?.map(
          (document: DefaultContextSchema['documents'][number]) => ({
            ...document,
            decision: {
              ...document?.decision,
              status: document?.decision?.status === null ? undefined : document?.decision?.status,
            },
            type:
              document?.type === 'unknown' && document?.decision?.status === 'approved'
                ? undefined
                : document?.type,
          }),
        ),
      });

      // @ts-ignore
      data?.context?.documents?.forEach(({ propertiesSchema, ...document }) => {
        if (document?.decision?.status !== 'approve') return;

        if (!Object.keys(propertiesSchema ?? {})?.length) return;

        const validatePropertiesSchema = ajv.compile(propertiesSchema ?? {}); // we shouldn't rely on schema from the client, add to tech debt
        const isValidPropertiesSchema = validatePropertiesSchema(document?.properties);

        if (!isValidPropertiesSchema) {
          throw new AjvValidationError(validatePropertiesSchema.errors);
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
    const isResolved = isFinal || data.status === WorkflowRuntimeDataStatus.completed;

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
        projectIds,
      );

      // Updates the collect documents workflow with the manual review workflow's decision.
      await this.workflowRuntimeDataRepository.updateById(parentMachine?.id, {
        data: {
          status: 'active',
          //@ts-expect-error
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
          projectId,
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
          projectId,
        },
      });
    } else {
      updatedResult = await this.workflowRuntimeDataRepository.updateById(workflowRuntimeId, {
        data: {
          ...data,
          resolvedAt: isResolved ? new Date().toISOString() : null,
          projectId,
        },
      });
    }

    if (isResolved) {
      this.logger.log('Workflow resolved', { id: workflowRuntimeId });

      this.workflowEventEmitter.emit('workflow.completed', {
        runtimeData: updatedResult,
        state: currentState ?? updatedResult.state,
        // @ts-ignore - error from Prisma types fix
        entityId: updatedResult.businessId || updatedResult.endUserId,
        correlationId,
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

    if (data.postUpdateEventName) {
      return await this.event(
        { name: data.postUpdateEventName, id: workflowRuntimeId },
        projectIds,
        projectId,
      );
    }

    return updatedResult;
  }

  async updateWorkflowRuntimeLanguage(
    workflowRuntimeId: string,
    language: string,
    projectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    const projectIds: TProjectIds = projectId ? [projectId] : null;

    return await this.workflowRuntimeDataRepository.updateRuntimeConfigById(
      workflowRuntimeId,
      { language },
      'by_index',
      projectIds,
    );
  }

  async assignWorkflowToUser(
    workflowRuntimeId: string,
    { assigneeId }: WorkflowAssigneeId,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
  ) {
    const workflowRuntimeData = await this.workflowRuntimeDataRepository.findById(
      workflowRuntimeId,
      {},
      projectIds,
    );
    const workflowCompleted =
      workflowRuntimeData.status === 'completed' || workflowRuntimeData.state === 'failed';

    if (workflowCompleted) {
      throw new BadRequestException(
        `Workflow ${workflowRuntimeId} is already completed or failed, cannot assign to user`,
      );
    }

    const updatedWorkflowRuntimeData = await this.workflowRuntimeDataRepository.updateById(
      workflowRuntimeId,
      { data: { assigneeId, assignedAt: new Date(), projectId: currentProjectId } },
    );

    if (
      updatedWorkflowRuntimeData.salesforceObjectName &&
      updatedWorkflowRuntimeData.salesforceRecordId
    ) {
      let agentName = '';

      if (assigneeId) {
        const user = await this.userService.getById(assigneeId, {}, projectIds);
        agentName = `${user.firstName} ${user.lastName}`;
      }

      await this.updateSalesforceRecord({
        workflowRuntimeData: updatedWorkflowRuntimeData,
        data: {
          KYB_Assigned_Agent__c: agentName,
        },
      });
    }

    return updatedWorkflowRuntimeData;
  }

  private async getCorrelationIdFromWorkflow(
    runtimeData: WorkflowRuntimeData,
    projectIds: TProjectIds,
  ) {
    let correlationId: string;
    if (runtimeData.businessId) {
      correlationId = (await this.businessRepository.getCorrelationIdById(
        runtimeData.businessId,
        projectIds,
      )) as string;
    } else if (runtimeData.endUserId) {
      correlationId = (await this.endUserRepository.getCorrelationIdById(
        runtimeData.endUserId,
        projectIds,
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
    args: Parameters<WorkflowDefinitionRepository['deleteById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.workflowDefinitionRepository.deleteById(id, args, projectIds);
  }

  async handleRuntimeFinalState(
    runtime: WorkflowRuntimeData,
    context: Record<string, unknown>,
    workflow: WorkflowDefinition,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
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
    await this.workflowDefinitionRepository.findById(workflow.reviewMachineId, {}, projectIds);

    const entitySearch: { businessId?: string; endUserId?: string } = {};

    if (businessId) {
      entitySearch.businessId = runtime.businessId as string;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      entitySearch.endUserId = runtime.endUserId as string;
    }

    const manualReviewWorkflow = await this.workflowRuntimeDataRepository.findOne(
      {
        where: {
          ...entitySearch,
          context: {
            path: ['parentMachine', 'id'],
            equals: runtime.id,
          },
        },
      },
      projectIds,
    );

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
          projectId: currentProjectId,
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
          currentProjectId,
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
          projectId: currentProjectId,
        },
      });
    }

    await this.updateWorkflowRuntimeData(
      runtime.id,
      {
        status: 'completed',
      },
      currentProjectId,
    );
  }

  async resolveIntent(
    intent: string,
    entityId: string,
    entityType: TEntityType,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
  ) {
    const workflowDefinitionResolver = policies[intent as keyof typeof policies];
    const entity = await (async () => {
      if (entityType === 'business')
        return await this.businessRepository.findById(entityId, {}, projectIds);
      if (entityType === 'endUser')
        return await this.endUserRepository.findById(entityId, {}, projectIds);

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
        // @ts-ignore
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
    return this.createOrUpdateWorkflowRuntime({
      workflowDefinitionId,
      context,
      projectIds,
      currentProjectId,
    });
  }

  omitTypeFromDocumentsPages(documents: DefaultContextSchema['documents']) {
    return documents?.map(document => ({
      ...document,
      pages: document?.pages?.map(({ type: _type, ...page }) => page),
    }));
  }

  async createOrUpdateWorkflowRuntime({
    workflowDefinitionId,
    context,
    config,
    parentWorkflowId,
    projectIds,
    currentProjectId,
    ...salesforceData
  }: {
    workflowDefinitionId: string;
    context: DefaultContextSchema;
    config?: WorkflowConfig;
    parentWorkflowId?: string;
    projectIds: TProjectIds;
    currentProjectId: TProjectId;
    // eslint-disable-next-line @typescript-eslint/ban-types
  } & ({ salesforceObjectName: string; salesforceRecordId: string } | {})) {
    const workflowDefinition = await this.workflowDefinitionRepository.findById(
      workflowDefinitionId,
      {},
      projectIds,
    );
    config = merge(workflowDefinition.config, config);
    let validatedConfig: WorkflowConfig;
    try {
      validatedConfig = ConfigSchema.parse(config);
    } catch (error) {
      throw new BadRequestException(error);
    }
    const customer = await this.customerService.getByProjectId(projectIds![0]!);
    // @ts-ignore
    context.customerName = customer.displayName;
    this.__validateWorkflowDefinitionContext(workflowDefinition, context);
    const entityId = await this.__findOrPersistEntityInformation(
      context,
      projectIds,
      currentProjectId,
    );
    const entityType = context.entity.type === 'business' ? 'business' : 'endUser';
    const existingWorkflowRuntimeData =
      await this.workflowRuntimeDataRepository.findActiveWorkflowByEntity(
        {
          entityId,
          entityType,
          workflowDefinitionId: workflowDefinition.id,
        },
        projectIds,
      );

    let contextToInsert = structuredClone(context);

    // @ts-ignore
    contextToInsert.entity.ballerineEntityId ||= entityId;

    const entityConnect = {
      [`${entityType}Id`]: entityId,
    };

    let workflowRuntimeData: WorkflowRuntimeData, newWorkflowCreated: boolean;

    const mergedConfig: WorkflowConfig = merge(
      workflowDefinition.config,
      validatedConfig || {},
    ) as InputJsonValue;

    // Creating new workflow
    if (!existingWorkflowRuntimeData || mergedConfig?.allowMultipleActiveWorkflows) {
      const contextWithoutDocumentPageType = {
        ...contextToInsert,
        documents: this.omitTypeFromDocumentsPages(contextToInsert.documents),
      };

      const documentsWithPersistedImages = await this.copyDocumentsPagesFilesAndCreate(
        contextWithoutDocumentPageType?.documents,
        entityId,
        currentProjectId,
        customer.name,
      );

      workflowRuntimeData = await this.workflowRuntimeDataRepository.create({
        data: {
          ...entityConnect,
          workflowDefinitionVersion: workflowDefinition.version,
          context: {
            ...contextToInsert,
            documents: documentsWithPersistedImages,
          } as InputJsonValue,
          config: mergedConfig as InputJsonValue,
          // @ts-expect-error - error from Prisma types fix
          state: workflowDefinition.definition.initial as string,
          status: 'active',
          workflowDefinitionId: workflowDefinition.id,
          ...(parentWorkflowId &&
            ({
              parentRuntimeDataId: parentWorkflowId,
            } satisfies Omit<
              Prisma.WorkflowRuntimeDataCreateArgs['data'],
              'context' | 'workflowDefinitionVersion'
            >)),
          ...('salesforceObjectName' in salesforceData && salesforceData),
          projectId: currentProjectId,
        },
      });

      logDocumentWithoutId({
        line: 'createOrUpdateWorkflow 1476',
        logger: this.logger,
        workflowRuntimeData,
      });

      const mainRepresentative =
        workflowRuntimeData.context.entity?.data?.additionalInfo?.mainRepresentative;
      if (mergedConfig.createCollectionFlowToken) {
        const endUserId =
          entityType === 'endUser'
            ? entityId
            : await this.__generateEndUserWithBusiness({
                entityType,
                workflowRuntimeData,
                entityData: mainRepresentative,
                currentProjectId,
                entityId,
              });

        const nowPlus30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const workflowToken = await this.workflowTokenService.create(currentProjectId, {
          workflowRuntimeDataId: workflowRuntimeData.id,
          endUserId: endUserId,
          expiresAt: nowPlus30Days,
        });

        workflowRuntimeData = await this.workflowRuntimeDataRepository.updateById(
          workflowRuntimeData.id,
          {
            data: {
              context: {
                ...workflowRuntimeData.context,
                metadata: {
                  customerNormalizedName: customer.name,
                  customerName: customer.displayName,
                  token: workflowToken.token,
                  collectionFlowUrl: env.COLLECTION_FLOW_URL,
                  webUiSDKUrl: env.WEB_UI_SDK_URL,
                },
              } as InputJsonValue,
              projectId: currentProjectId,
            },
          },
        );
      }

      mergedConfig?.initialEvent &&
        (await this.event(
          {
            id: workflowRuntimeData.id,
            name: mergedConfig?.initialEvent,
          },
          projectIds,
          currentProjectId,
        ));
      workflowRuntimeData = await this.workflowRuntimeDataRepository.findById(
        workflowRuntimeData.id,
        {},
        projectIds,
      );

      if ('salesforceObjectName' in salesforceData && salesforceData.salesforceObjectName) {
        await this.updateSalesforceRecord({
          workflowRuntimeData,
          data: {
            KYB_Started_At__c: workflowRuntimeData.createdAt,
            KYB_Status__c: 'In Progress',
            KYB_Assigned_Agent__c: '',
          },
        });
      }

      newWorkflowCreated = true;
    } else {
      // Updating existing workflow
      this.logger.log('existing documents', existingWorkflowRuntimeData.context.documents);
      this.logger.log('documents', contextToInsert.documents);
      // contextToInsert.documents = updateDocuments(
      //   existingWorkflowRuntimeData.context.documents,
      //   context.documents,
      // );
      const documentsWithPersistedImages = await this.copyDocumentsPagesFilesAndCreate(
        contextToInsert?.documents,
        entityId,
        currentProjectId,
        customer.name,
      );

      contextToInsert = {
        ...contextToInsert,
        documents: documentsWithPersistedImages as DefaultContextSchema['documents'],
      };

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
            projectId: currentProjectId,
          },
        },
      );

      logDocumentWithoutId({
        line: 'createOrUpdateWorkflow 1584',
        logger: this.logger,
        workflowRuntimeData,
      });

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
    ] as const;
  }

  private async __generateEndUserWithBusiness({
    entityData,
    workflowRuntimeData,
    currentProjectId,
    entityType,
    entityId,
  }: {
    entityType: string;
    workflowRuntimeData: WorkflowRuntimeData;
    entityData?: { firstName: string; lastName: string };
    currentProjectId: string;
    entityId: string;
  }) {
    if (entityData && entityType === 'business')
      return (
        await this.endUserService.createWithBusiness(
          {
            endUser: {
              ...entityData,
              isContactPerson: true,
            },
            business: {
              companyName: '',
              ...workflowRuntimeData.context.entity.data,
              projectId: currentProjectId,
            },
          },
          currentProjectId,
          entityId,
        )
      ).id;

    throw new Error(
      `Invalid entity type or payload for child workflow creation for entity: ${entityType} with context:`,
      workflowRuntimeData.context.entity,
    );
  }

  private async __persistDocumentPagesFiles(
    document: TDocumentWithoutPageType,
    entityId: string,
    projectId: TProjectId,
    customerName: string,
  ) {
    return await Promise.all(
      document?.pages?.map(async documentPage => {
        if (documentPage.ballerineFileId) return documentPage;

        const documentId = document.id! || getDocumentId(document, false);

        const persistedFile = await this.fileService.copyToDestinationAndCreate(
          {
            id: documentId,
            // @ts-ignore
            uri: documentPage.uri,
            // @ts-ignore
            provider: documentPage.provider,
            // TODO: Solve once DefaultContextSchema is typed by Typebox
            fileName: (
              documentPage as typeof documentPage & {
                fileName: string;
              }
            ).fileName,
          },
          entityId,
          projectId,
          customerName,
        );

        const ballerineFileId = documentPage.ballerineFileId || persistedFile?.id;
        const mimeType =
          persistedFile?.mimeType ||
          mime.getType(persistedFile.fileName || persistedFile.uri || '') ||
          undefined;

        return {
          ...documentPage,
          type: mimeType,
          ballerineFileId,
          fileName: persistedFile?.fileName,
        };
      }),
    );
  }

  private async __findOrPersistEntityInformation(
    context: DefaultContextSchema,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
  ) {
    const { entity } = context;
    const entityId = await this.__tryToFetchExistingEntityId(entity, projectIds);

    if (entityId) {
      return entityId;
    }

    if (!entity.data) {
      throw new BadRequestException('Entity data is required');
    }

    if (entity.type === 'individual') {
      return await this.__persistEndUserInfo(entity, context, currentProjectId);
    } else {
      return await this.__persistBusinessInformation(entity, context, projectIds, currentProjectId);
    }
  }

  private async __persistEndUserInfo(
    entity: { [p: string]: unknown },
    context: DefaultContextSchema,
    projectId: TProjectId,
  ) {
    const { id } = await this.endUserRepository.create({
      data: {
        correlationId: entity.id,
        ...(context.entity.data as object),
        project: { connect: { id: projectId } },
      } as Prisma.EndUserCreateInput,
    });
    return id;
  }

  private async __persistBusinessInformation(
    entity: { [p: string]: unknown },
    context: DefaultContextSchema,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
  ) {
    const { id } = await this.businessRepository.create({
      data: {
        correlationId: entity.id,
        ...(context.entity.data as object),
        project: { connect: { id: currentProjectId } },
      } as Prisma.BusinessCreateInput,
    });

    return id;
  }

  private async __tryToFetchExistingEntityId(
    entity: {
      [p: string]: unknown;
    },
    projectIds: TProjectIds,
  ): Promise<TEntityId | null> {
    if (entity.ballerineEntityId) {
      return entity.ballerineEntityId as TEntityId;
    } else if (!entity.id) {
      return null;
    } else {
      if (entity.type === 'business') {
        const res = await this.businessRepository.findByCorrelationId(
          entity.id as TEntityId,
          {},
          projectIds,
        );
        return res && res.id;
      } else {
        const res = await this.endUserRepository.findByCorrelationId(
          entity.id as TEntityId,
          {},
          projectIds,
        );
        return res && res.id;
      }
    }
  }

  private __validateWorkflowDefinitionContext(
    workflowDefinition: WorkflowDefinition,
    context: DefaultContextSchema,
  ) {
    if (!Object.keys(workflowDefinition?.contextSchema ?? {}).length) return;

    // @ts-expect-error - error from Prisma types fix
    const validate = ajv.compile(workflowDefinition?.contextSchema?.schema); // TODO: fix type
    const isValid = validate({
      ...context,
      // Validation should not include the documents' 'propertiesSchema' prop.
      documents: context?.documents?.map(
        ({
          // @ts-ignore
          propertiesSchema: _propertiesSchema,
          ...document
        }) => document,
      ),
    });

    if (isValid) return;

    throw new AjvValidationError(validate.errors);
  }

  async event(
    { name: type, id }: WorkflowEventInput & IObjectWithId,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
  ) {
    this.logger.log('Workflow event received', { id, type });
    const workflowRuntimeData = await this.workflowRuntimeDataRepository.findById(
      id,
      {},
      projectIds,
    );
    const workflowDefinition = await this.workflowDefinitionRepository.findById(
      workflowRuntimeData.workflowDefinitionId,
      {} as any,
      projectIds,
    );

    const service = createWorkflow({
      runtimeId: workflowRuntimeData.id,
      // @ts-expect-error - error from Prisma types fix
      definition: workflowDefinition.definition,
      // @ts-expect-error - error from Prisma types fix
      definitionType: workflowDefinition.definitionType,
      config: workflowRuntimeData.config,
      workflowContext: {
        machineContext: workflowRuntimeData.context,
        state: workflowRuntimeData.state,
      },
      // @ts-expect-error - error from Prisma types fix
      extensions: workflowDefinition.extensions,
      invokeChildWorkflowAction: async (childPluginConfiguration: ChildPluginCallbackOutput) => {
        const runnableChildWorkflow = await this.persistChildEvent(
          childPluginConfiguration,
          projectIds,
          currentProjectId,
        );

        if (runnableChildWorkflow && childPluginConfiguration.initOptions.event) {
          // TODO: Review the issue if return child workflow id for parent and not "send event"
          await this.event(
            {
              id: runnableChildWorkflow.workflowRuntimeData.id,
              name: childPluginConfiguration.initOptions.event,
            },
            projectIds,
            currentProjectId,
          );
        }
      },
    });

    if (!service.getSnapshot().nextEvents.includes(type)) {
      throw new BadRequestException(
        `Event ${type} does not exist for workflow ${workflowDefinition.id}'s state: ${workflowRuntimeData.state}`,
      );
    }

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
    const updatedRuntimeData = await this.updateWorkflowRuntimeData(
      workflowRuntimeData.id,
      {
        context,
        state: currentState,
        tags: Array.from(snapshot.tags) as unknown as WorkflowDefinitionUpdateInput['tags'],
        status: isFinal ? 'completed' : workflowRuntimeData.status,
      },
      currentProjectId,
    );

    if (workflowRuntimeData.parentRuntimeDataId) {
      await this.persistChildWorkflowToParent(
        workflowRuntimeData,
        workflowDefinition,
        isFinal,
        projectIds,
        currentProjectId,
        currentState,
      );
    }

    this.workflowEventEmitter.emit('workflow.state.changed', {
      //@ts-expect-error
      entityId,
      state: updatedRuntimeData.state,
      correlationId: updatedRuntimeData.context.ballerineEntityId,
      runtimeData: updatedRuntimeData,
    });

    if (!isFinal || (currentState !== 'approved' && currentState !== 'rejected')) {
      return updatedRuntimeData;
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

    return updatedRuntimeData;
  }

  async persistChildWorkflowToParent(
    workflowRuntimeData: WorkflowRuntimeData,
    workflowDefinition: WorkflowDefinition,
    isFinal: boolean,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
    childRuntimeState?: string,
  ) {
    const parentWorkflowRuntime = await this.getWorkflowRuntimeWithChildrenDataById(
      // @ts-expect-error - error from Prisma types fix
      workflowRuntimeData.parentRuntimeDataId,
      { include: { childWorkflowsRuntimeData: true } },
      projectIds,
    );

    const parentWorkflowDefinition = await this.getWorkflowDefinitionById(
      parentWorkflowRuntime.workflowDefinitionId,
      {},
      projectIds,
    );

    const callbackTransformations = (
      parentWorkflowDefinition?.config
        ?.childCallbackResults as ChildToParentCallback['childCallbackResults']
    )
      // @ts-ignore - fix as childCallbackResults[number]
      ?.filter(childCallbackResult => workflowDefinition.id === childCallbackResult.definitionId)
      ?.map(async callbackTransformation => {
        const childWorkflowCallback = (callbackTransformation ||
          workflowDefinition.config.callbackResult!) as ChildWorkflowCallback;

        const childrenOfSameDefinition = // @ts-ignore - error from Prisma types fix
          (parentWorkflowRuntime.childWorkflowsRuntimeData as Array<WorkflowRuntimeData>)?.filter(
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
        );

        await this.updateWorkflowRuntimeData(
          parentWorkflowRuntime.id,
          { context: parentContext },
          currentProjectId,
        );

        if (
          childWorkflowCallback.deliverEvent &&
          parentWorkflowRuntime.status !== WorkflowRuntimeDataStatus.completed
        ) {
          try {
            await this.event(
              {
                id: parentWorkflowRuntime.id,
                name: childWorkflowCallback.deliverEvent,
              },
              projectIds,
              currentProjectId,
            );
          } catch (ex) {
            console.warn(
              'Error while delivering event to parent workflow',
              isErrorWithMessage(ex) && ex.message,
            );
          }
        }
      });

    if (!callbackTransformations?.length) return;

    await Promise.all(callbackTransformations);
  }

  private async generateParentContextWithInjectedChildContext(
    childrenOfSameDefinition: WorkflowRuntimeData[],
    transformers: ChildWorkflowCallback['transformers'],
    parentWorkflowRuntime: WorkflowRuntimeData,
    workflowDefinition: WorkflowDefinition,
  ) {
    const transformerInstance = (transformers || []).map((transformer: SerializableTransformer) =>
      this.initiateTransformer(transformer),
    );

    const contextToPersist: Record<string, any> = {};

    for (const childWorkflow of childrenOfSameDefinition) {
      let childContextToPersist = childWorkflow.context;

      for (const transformer of transformerInstance || []) {
        childContextToPersist = await transformer.transform({
          ...childContextToPersist,
          projectId: parentWorkflowRuntime.projectId,
        });
      }
      contextToPersist[childWorkflow.id] = {
        entityId: childWorkflow.context.entity.id,
        status: childWorkflow.status,
        tags: childWorkflow.tags,
        state: childWorkflow.state,
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

  async getWorkflowRuntimeDataContext(id: string, projectIds: TProjectIds) {
    return this.workflowRuntimeDataRepository.findContext(id, projectIds);
  }

  async getLastActiveFlow({
    email,
    workflowRuntimeDefinitionId,
    projectIds,
  }: GetLastActiveFlowParams): Promise<WorkflowRuntimeData | null> {
    const endUser = await this.endUserService.getByEmail(email, projectIds);

    if (!endUser || !endUser?.businesses?.length) return null;

    const query = {
      endUserId: endUser.id,
      ...{
        workflowDefinitionId: workflowRuntimeDefinitionId,
        businessId: endUser.businesses.at(-1)!.id,
      },
      projectIds,
    };

    this.logger.log(`Getting last active workflow`, query);

    const workflowData = await this.workflowRuntimeDataRepository.findLastActive(query, projectIds);

    this.logger.log('Last active workflow: ', {
      workflowId: workflowData ? workflowData.id : null,
    });

    return workflowData ? workflowData : null;
  }

  async copyDocumentsPagesFilesAndCreate(
    documents: TDocumentsWithoutPageType,
    entityId: string,
    projectId: TProjectId,
    customerName: string,
  ) {
    if (!documents?.length) return documents;

    const documentsWithPersistedImages = await Promise.all(
      documents?.map(async document => {
        return {
          ...document,
          pages: await this.__persistDocumentPagesFiles(
            document,
            entityId,
            projectId,
            customerName,
          ),
        };
      }),
    );

    return documentsWithPersistedImages;
  }

  async updateSalesforceRecord({
    workflowRuntimeData,
    data,
  }: {
    workflowRuntimeData: WorkflowRuntimeData;
    data: {
      KYB_Started_At__c?: Date;
      KYB_Status__c?: 'Not Started' | 'In Progress' | 'Approved' | 'Rejected';
      KYB_Assigned_Agent__c?: string;
    };
  }) {
    return await this.salesforceService.updateRecord({
      projectId: workflowRuntimeData.projectId,
      // @ts-expect-error - error from Prisma types fix
      objectName: workflowRuntimeData.salesforceObjectName,
      // @ts-expect-error - error from Prisma types fix
      recordId: workflowRuntimeData.salesforceRecordId,
      data,
    });
  }

  async emitSystemWorkflowEvent({
    workflowRuntimeId,
    projectId,
    systemEventName,
  }: {
    workflowRuntimeId: string;
    projectId: string;
    systemEventName: 'workflow.context.changed'; // currently supports only this event
  }) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(workflowRuntimeId, {}, [
      projectId,
    ]);
    const correlationId = await this.getCorrelationIdFromWorkflow(runtimeData, [projectId]);

    this.workflowEventEmitter.emit(
      systemEventName,
      {
        oldRuntimeData: runtimeData,
        updatedRuntimeData: runtimeData,
        state: runtimeData.state as string,
        entityId: (runtimeData.businessId || runtimeData.endUserId) as string,
        correlationId: correlationId,
      },
      {
        forceEmit: true,
      },
    );
  }
}
