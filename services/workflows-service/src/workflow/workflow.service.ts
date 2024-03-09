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
import type {
  InputJsonValue,
  IObjectWithId,
  PrismaTransaction,
  TProjectId,
  TProjectIds,
} from '@/types';
import { UserService } from '@/user/user.service';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';
import { WorkflowAssigneeId } from '@/workflow/dtos/workflow-assignee-id';
import { WorkflowDefinitionCloneDto } from '@/workflow/dtos/workflow-definition-clone';
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
  ARRAY_MERGE_OPTION,
  BUILT_IN_EVENT,
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
  Prisma,
  PrismaClient,
  UiDefinitionContext,
  User,
  WorkflowDefinition,
  WorkflowRuntimeData,
  WorkflowRuntimeDataStatus,
} from '@prisma/client';
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
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';
import mime from 'mime';
import { env } from '@/env';
import { ValidationError } from '@/errors';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { ajv } from '@/common/ajv/ajv.validator';
import { PrismaService } from '@/prisma/prisma.service';
import {
  beginTransactionIfNotExistCurry,
  defaultPrismaTransactionOptions,
} from '@/prisma/prisma.util';
import { BusinessService } from '@/business/business.service';

type TEntityId = string;

export type TEntityType = 'endUser' | 'business';

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
    protected readonly businessService: BusinessService,
    protected readonly entityRepository: EntityRepository,
    protected readonly customerService: CustomerService,
    protected readonly fileService: FileService,
    protected readonly workflowEventEmitter: WorkflowEventEmitterService,
    private readonly logger: AppLoggerService,
    private readonly projectScopeService: ProjectScopeService,
    private readonly userService: UserService,
    private readonly salesforceService: SalesforceService,
    private readonly workflowTokenService: WorkflowTokenService,
    private readonly uiDefinitionService: UiDefinitionService,
    private readonly prismaService: PrismaService,
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

  async getWorkflowRuntimeDataByIdAndLockUnscoped({
    id,
    transaction,
  }: {
    id: string;
    transaction: PrismaTransaction | PrismaClient;
  }) {
    return await this.workflowRuntimeDataRepository.findByIdAndLockUnscoped({
      id,
      transaction,
    });
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
    transaction: PrismaTransaction,
  ) {
    const childWorkflow = (
      await this.createOrUpdateWorkflowRuntime(
        {
          workflowDefinitionId: childPluginConfig.definitionId,
          context: childPluginConfig.initOptions.context as unknown as DefaultContextSchema,
          config: childPluginConfig.initOptions.config as unknown as AnyRecord,
          parentWorkflowId: childPluginConfig.parentWorkflowRuntimeId,
          projectIds,
          currentProjectId,
        },
        transaction,
      )
    )[0];

    if (childWorkflow) {
      const newContext = {
        childWorkflows: {
          [childWorkflow.workflowRuntimeData.id]: {
            [childWorkflow.workflowRuntimeData.id]: {
              entityId: childWorkflow.workflowRuntimeData.context.entity.id,
              status: childWorkflow.workflowRuntimeData.status || 'active',
              state: childWorkflow.workflowRuntimeData.state,
            },
          },
        },
      };

      await this.event(
        {
          id: childPluginConfig.parentWorkflowRuntimeId,
          name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
          payload: {
            newContext,
            arrayMergeOption: ARRAY_MERGE_OPTION.REPLACE,
          },
        },
        projectIds,
        currentProjectId,
        transaction,
      );
    }

    return childWorkflow;
  }

  async getWorkflowDefinitionById(
    id: string,
    args: Parameters<WorkflowDefinitionRepository['findById']>[1],
    projectIds: TProjectIds,
    transaction?: PrismaTransaction,
  ) {
    return await this.workflowDefinitionRepository.findById(id, args, projectIds, transaction);
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
      search,
    }: {
      search?: string;
      args: Parameters<WorkflowRuntimeDataRepository['findMany']>[0];
      entityType: 'individuals' | 'businesses';
      orderBy: Parameters<typeof toPrismaOrderBy>[0];
      page: {
        number: number;
        size: number;
      };
      filters?: {
        assigneeId?: Array<string | null>;
        status?: WorkflowRuntimeDataStatus[];
        caseStatus?: string[];
      };
    },
    projectIds: TProjectIds,
  ) {
    const skip = (page.number - 1) * page.size;

    const query = this.projectScopeService.scopeFindMany(
      merge(
        args,
        {
          orderBy: toPrismaOrderBy(orderBy, entityType),
          where: filters ? toPrismaWhere(filters) : {},
          skip,
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

    const getWorkflowDefinitionIds = () => {
      if (typeof query?.where?.workflowDefinitionId === 'string') {
        return [query.where.workflowDefinitionId];
      }

      if (Array.isArray(query?.where?.workflowDefinitionId?.in)) {
        return query?.where?.workflowDefinitionId?.in;
      }

      return [];
    };

    const workflowIds = await this.workflowRuntimeDataRepository.search(
      {
        query: {
          skip,
          take: page.size,
          search: search ?? '',
          entityType,
          statuses:
            ((query.where.status as Prisma.EnumWorkflowRuntimeDataStatusFilter)?.in as string[]) ||
            [],
          workflowDefinitionIds: getWorkflowDefinitionIds(),
          orderBy,
        },
        filters,
      },
      projectIds,
    );

    const workflowsQuery = {
      ...query,
      where: { id: { in: workflowIds.map(workflowId => workflowId.id) } },
    };

    const [workflowCount, workflows] = await Promise.all([
      this.workflowRuntimeDataRepository.count({ where: query.where }, projectIds),
      this.workflowRuntimeDataRepository.findMany(
        {
          where: workflowsQuery.where,
          select: workflowsQuery.select,
          orderBy: workflowsQuery.orderBy,
        },
        projectIds,
      ),
    ]);

    if (page.number > 1 && workflowCount < skip + 1) {
      throw new NotFoundException('Page not found');
    }

    return {
      data: this.formatWorkflowsRuntimeData(workflows as unknown as TWorkflowWithRelations[]),
      meta: {
        totalItems: workflowCount,
        totalPages: Math.max(Math.ceil(workflowCount / page.size), 1),
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

    return {
      results: this.workflowsRuntimeListItemsFactory(
        workflowsRuntime as unknown as WorkflowRuntimeListQueryResult[],
      ),
      meta: {
        pages: size ? Math.max(Math.ceil(workflowsRuntimeCount / size)) : 0,
        total: workflowsRuntimeCount,
      },
    };
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
    return await this.prismaService.$transaction(async transaction => {
      const runtimeData = await this.workflowRuntimeDataRepository.findByIdAndLock(
        id,
        {},
        [projectId],
        transaction,
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
            ...runtimeData.context,
            documents: documentsWithDecision,
          },
        },
        projectId,
        transaction,
      );

      await this.event(
        {
          id,
          name,
        },
        projectId ? [projectId] : null,
        projectId,
        transaction,
      );

      return updatedWorkflow;
    }, defaultPrismaTransactionOptions);
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
  ) {
    return await this.prismaService.$transaction(async transaction => {
      const workflow = await this.workflowRuntimeDataRepository.findByIdAndLock(
        workflowId,
        {},
        projectIds,
        transaction,
      );
      const workflowDefinition = await this.workflowDefinitionRepository.findById(
        workflow?.workflowDefinitionId,
        {},
        projectIds,
        transaction,
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
            document?.type === 'unknown' && updatedStatus === 'approved'
              ? undefined
              : document?.type,
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
      const validateDocumentSchema = status === 'approved';

      const updatedWorkflow = await this.updateDocumentById(
        {
          workflowId,
          documentId,
          validateDocumentSchema,
          documentsUpdateContextMethod: documentsUpdateContextMethod,
        },
        documentWithDecision as unknown as DefaultContextSchema['documents'][number],
        projectIds![0]!,
        transaction,
      );

      logDocumentWithoutId({
        line: 'updateDocumentDecisionById 770',
        logger: this.logger,
        workflowRuntimeData: updatedWorkflow,
      });

      return updatedWorkflow;
    }, defaultPrismaTransactionOptions);
  }

  async updateDocumentById(
    {
      workflowId,
      documentId,
      validateDocumentSchema = true,
      documentsUpdateContextMethod,
    }: {
      workflowId: string;
      documentId: string;
      validateDocumentSchema?: boolean;
      documentsUpdateContextMethod?: 'base' | 'director';
    },
    data: DefaultContextSchema['documents'][number] & { propertiesSchema?: object },
    projectId: TProjectId,
    transaction?: PrismaTransaction,
  ) {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return await beginTransactionIfNotExist(async transaction => {
      const runtimeData = await this.workflowRuntimeDataRepository.findByIdAndLock(
        workflowId,
        {},
        [projectId],
        transaction,
      );
      const workflowDef = await this.workflowDefinitionRepository.findById(
        runtimeData.workflowDefinitionId,
        {},
        [projectId],
        transaction,
      );
      const documentToUpdate = runtimeData?.context?.documents?.find(
        (document: DefaultContextSchema['documents'][number]) => document.id === documentId,
      );

      const document = {
        ...data,
        id: documentId,
      };

      const documentSchema = addPropertiesSchemaToDocument(document, workflowDef.documentsSchema);
      const propertiesSchema = documentSchema?.propertiesSchema ?? {};

      if (Object.keys(propertiesSchema)?.length && validateDocumentSchema) {
        const propertiesSchemaForValidation = propertiesSchema;

        const validatePropertiesSchema = ajv.compile(propertiesSchemaForValidation);

        const isValidPropertiesSchema = validatePropertiesSchema(documentSchema?.properties);

        if (!isValidPropertiesSchema && document.type === documentToUpdate.type) {
          throw ValidationError.fromAjvError(validatePropertiesSchema.errors!);
        }
      }

      let updatedWorkflow = await this.event(
        {
          id: workflowId,
          name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
          payload: {
            newContext: this.updateDocumentInContext(
              runtimeData.context,
              documentSchema,
              documentsUpdateContextMethod,
            ),
            arrayMergeOption:
              documentsUpdateContextMethod === 'director'
                ? ARRAY_MERGE_OPTION.BY_INDEX
                : ARRAY_MERGE_OPTION.BY_ID,
          },
        },
        [projectId],
        projectId,
        transaction,
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
          updatedWorkflow = await this.workflowRuntimeDataRepository.updateStateById(
            workflowId,
            {
              data: {
                status: allDocumentsResolved ? 'completed' : updatedWorkflow.status,
                resolvedAt: new Date().toISOString(),
              },
            },
            transaction,
          );

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
    });
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

  async updateWorkflowRuntimeData(
    workflowRuntimeId: string,
    data: WorkflowDefinitionUpdateInput,
    projectId: TProjectId,
    transaction?: PrismaTransaction,
  ): Promise<WorkflowRuntimeData> {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return await beginTransactionIfNotExist(async transaction => {
      const projectIds: TProjectIds = projectId ? [projectId] : null;

      const runtimeData = await this.workflowRuntimeDataRepository.findByIdAndLock(
        workflowRuntimeId,
        {},
        projectIds,
        transaction,
      );
      const workflowDef = await this.workflowDefinitionRepository.findById(
        runtimeData.workflowDefinitionId,
        {},
        projectIds,
      );

      const correlationId: string = await this.getCorrelationIdFromWorkflow(
        runtimeData,
        projectIds,
      );

      let contextHasChanged;

      if (data.context) {
        data.context.documents = assignIdToDocuments(data.context.documents);
        contextHasChanged = !isEqual(data.context, runtimeData.context);

        this.__validateWorkflowDefinitionContext(workflowDef, {
          ...data.context,
          documents: data.context?.documents?.map(
            (document: DefaultContextSchema['documents'][number]) => ({
              ...document,
              decision: {
                ...document?.decision,
                status:
                  document?.decision?.status === null ? undefined : document?.decision?.status,
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
            throw ValidationError.fromAjvError(validatePropertiesSchema.errors!);
          }
        });
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

      const updatedResult = (await this.workflowRuntimeDataRepository.updateStateById(
        runtimeData.id,
        {
          data: {
            ...data,
            resolvedAt: isResolved ? new Date().toISOString() : null,
          },
          include: { assignee: true },
        },
        transaction,
      )) as WorkflowRuntimeData & { assignee: User | null };

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
          assignee: updatedResult.assignee,
          assignedAt: updatedResult.assignedAt,
          oldRuntimeData: runtimeData,
          updatedRuntimeData: updatedResult,
          state: currentState as string,
          entityId: (runtimeData.businessId || runtimeData.endUserId) as string,
          correlationId: correlationId,
        });
      }

      return updatedResult;
    });
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
      ARRAY_MERGE_OPTION.BY_INDEX,
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

  omitTypeFromDocumentsPages(documents: DefaultContextSchema['documents']) {
    return documents?.map(document => ({
      ...document,
      pages: document?.pages?.map(({ type: _type, ...page }) => page),
    }));
  }

  async createOrUpdateWorkflowRuntime(
    {
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
    } & ({ salesforceObjectName: string; salesforceRecordId: string } | {}),
    transaction?: PrismaTransaction,
  ) {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return await beginTransactionIfNotExist(async transaction => {
      const workflowDefinition = await this.workflowDefinitionRepository.findById(
        workflowDefinitionId,
        {},
        projectIds,
      );

      config = merge(workflowDefinition.config, config);
      let validatedConfig: WorkflowConfig;
      const result = ConfigSchema.safeParse(config);

      if (!result.success) {
        throw ValidationError.fromZodError(result.error);
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
        await this.workflowRuntimeDataRepository.findActiveWorkflowByEntityAndLock(
          {
            entityId,
            entityType,
            workflowDefinitionId: workflowDefinition.id,
          },
          projectIds,
          transaction,
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

      const entities: Array<{
        id: string;
        type: 'individual' | 'business';
        tags?: Array<'mainRepresentative' | 'UBO'>;
      }> = [];

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
        let uiDefinition;

        try {
          uiDefinition = await this.uiDefinitionService.getByWorkflowDefinitionId(
            workflowDefinitionId,
            UiDefinitionContext.collection_flow,
            projectIds,
            {},
          );
        } catch (err) {
          if (isErrorWithMessage(err)) {
            this.logger.warn(err.message);
          }
        }

        const uiSchema = (uiDefinition as Record<string, any>)?.uiSchema;

        const createFlowConfig = (uiSchema: Record<string, any>) => {
          return {
            stepsProgress: (
              uiSchema?.elements as Array<{
                type: string;
                number: number;
                stateName: string;
              }>
            )?.reduce((acc, curr) => {
              if (curr?.type !== 'page') {
                return acc;
              }

              acc[curr?.stateName] = {
                number: curr?.number,
                isCompleted: false,
              };

              return acc;
            }, {} as { [key: string]: { number: number; isCompleted: boolean } }),
          };
        };

        workflowRuntimeData = await this.workflowRuntimeDataRepository.create(
          {
            data: {
              ...entityConnect,
              workflowDefinitionVersion: workflowDefinition.version,
              context: {
                ...contextToInsert,
                documents: documentsWithPersistedImages,
                flowConfig: (contextToInsert as any)?.flowConfig ?? createFlowConfig(uiSchema),
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
          },
          transaction,
        );

        logDocumentWithoutId({
          line: 'createOrUpdateWorkflow 1476',
          logger: this.logger,
          workflowRuntimeData,
        });

        let endUserId: string;

        if (mergedConfig.createCollectionFlowToken) {
          if (entityType === 'endUser') {
            endUserId = entityId;
            entities.push({ type: 'individual', id: entityId });
          } else {
            endUserId = await this.__generateEndUserWithBusiness({
              entityType,
              workflowRuntimeData,
              entityData:
                workflowRuntimeData.context.entity?.data?.additionalInfo?.mainRepresentative,
              currentProjectId,
              entityId,
            });

            entities.push({
              type: 'individual',
              id: endUserId,
            });

            entities.push({ type: 'business', id: entityId });
          }

          const nowPlus30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          const workflowToken = await this.workflowTokenService.create(
            currentProjectId,
            {
              workflowRuntimeDataId: workflowRuntimeData.id,
              endUserId: endUserId,
              expiresAt: nowPlus30Days,
            },
            transaction,
          );

          workflowRuntimeData = await this.workflowRuntimeDataRepository.updateStateById(
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
                },
                projectId: currentProjectId,
              },
            },
            transaction,
          );
        }

        if (mergedConfig?.initialEvent) {
          workflowRuntimeData = await this.event(
            {
              id: workflowRuntimeData.id,
              name: mergedConfig?.initialEvent,
            },
            projectIds,
            currentProjectId,
            transaction,
          );
        }

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

        workflowRuntimeData = await this.workflowRuntimeDataRepository.updateStateById(
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
          transaction,
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
          entities,
        },
      ] as const;
    });
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
    const data = context.entity.data as Record<PropertyKey, unknown>;

    const { id } = await this.endUserService.create({
      data: {
        correlationId: entity.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        nationalId: data.nationalId,
        additionalInfo: data.additionalInfo,
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
    const { id } = await this.businessService.create({
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

    throw ValidationError.fromAjvError(validate.errors!);
  }

  async event(
    { name: type, id, payload }: WorkflowEventInput & IObjectWithId,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
    transaction?: PrismaTransaction,
  ) {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return await beginTransactionIfNotExist(async transaction => {
      this.logger.log('Workflow event received', { id, type });
      const workflowRuntimeData = await this.workflowRuntimeDataRepository.findByIdAndLock(
        id,
        {},
        projectIds,
        transaction,
      );
      const workflowDefinition = await this.workflowDefinitionRepository.findById(
        workflowRuntimeData.workflowDefinitionId,
        {},
        projectIds,
        transaction,
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
            transaction,
          );

          if (!runnableChildWorkflow || !childPluginConfiguration.initOptions.event) {
            return;
          }

          await this.event(
            {
              id: runnableChildWorkflow.workflowRuntimeData.id,
              name: childPluginConfiguration.initOptions.event,
            },
            projectIds,
            currentProjectId,
            transaction,
          );
        },
      });

      if (!service.getSnapshot().nextEvents.includes(type)) {
        throw new BadRequestException(
          `Event ${type} does not exist for workflow ${workflowDefinition.id}'s state: ${workflowRuntimeData.state}`,
        );
      }

      await service.sendEvent({
        type,
        ...(payload ? { payload } : {}),
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
        transaction,
      );

      if (workflowRuntimeData.parentRuntimeDataId) {
        await this.persistChildWorkflowToParent(
          workflowRuntimeData,
          workflowDefinition,
          isFinal,
          projectIds,
          currentProjectId,
          transaction,
          currentState,
        );
      }

      if (currentState !== workflowRuntimeData.state) {
        this.workflowEventEmitter.emit('workflow.state.changed', {
          //@ts-expect-error
          entityId,
          state: updatedRuntimeData.state,
          correlationId: updatedRuntimeData.context.ballerineEntityId,
          runtimeData: updatedRuntimeData,
        });
      }

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
        await this.entityRepository[entityType].updateById(
          entityId,
          {
            data: {
              approvalState,
            },
          },
          transaction,
        );
      }

      if (entityType === 'business') {
        await this.entityRepository[entityType].updateById(
          entityId,
          {
            data: {
              approvalState,
            },
          },
          transaction,
        );
      }

      return updatedRuntimeData;
    });
  }

  async persistChildWorkflowToParent(
    workflowRuntimeData: WorkflowRuntimeData,
    workflowDefinition: WorkflowDefinition,
    isFinal: boolean,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
    transaction: PrismaTransaction,
    childRuntimeState?: string,
  ) {
    let parentWorkflowRuntime = await this.workflowRuntimeDataRepository.findByIdAndLock(
      // @ts-expect-error - error from Prisma types fix
      workflowRuntimeData.parentRuntimeDataId,
      { include: { childWorkflowsRuntimeData: true } },
      projectIds,
      transaction,
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
          (parentWorkflowRuntime.childWorkflowsRuntimeData as WorkflowRuntimeData[])?.filter(
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

        parentWorkflowRuntime = await this.event(
          {
            id: parentWorkflowRuntime.id,
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            payload: {
              newContext: parentContext,
              arrayMergeOption: ARRAY_MERGE_OPTION.BY_ID,
            },
          },
          projectIds,
          currentProjectId,
          transaction,
        );

        if (
          childWorkflowCallback.deliverEvent &&
          parentWorkflowRuntime.status !== WorkflowRuntimeDataStatus.completed &&
          childRuntimeState &&
          childWorkflowCallback.persistenceStates?.includes(childRuntimeState)
        ) {
          try {
            await this.event(
              {
                id: parentWorkflowRuntime.id,
                name: childWorkflowCallback.deliverEvent,
              },
              projectIds,
              currentProjectId,
              transaction,
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
    const runtimeData = (await this.workflowRuntimeDataRepository.findById(
      workflowRuntimeId,
      { include: { assignee: true } },
      [projectId],
    )) as WorkflowRuntimeData & { assignee: User | null };
    const correlationId = await this.getCorrelationIdFromWorkflow(runtimeData, [projectId]);

    this.workflowEventEmitter.emit(
      systemEventName,
      {
        assignee: runtimeData.assignee,
        assignedAt: runtimeData.assignedAt,
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
