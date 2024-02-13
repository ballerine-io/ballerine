import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
  WorkflowRuntimeData,
  WorkflowRuntimeDataStatus,
} from '@prisma/client';
import { TEntityType } from '@/workflow/types';
import { merge } from 'lodash';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';
import { FindLastActiveFlowParams } from '@/workflow/types/params';
import { ProjectScopeService } from '@/project/project-scope.service';
import { SortOrder } from '@/common/query-filters/sort-order';
import type { PrismaTransaction, TProjectIds } from '@/types';

export type ArrayMergeOption = 'by_id' | 'by_index' | 'concat' | 'replace';

type StateRelatedColumns = 'state' | 'status' | 'context' | 'tags';

@Injectable()
export class WorkflowRuntimeDataRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly projectScopeService: ProjectScopeService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.WorkflowRuntimeDataCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataCreateArgs>,
  ): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.create<T>({
      ...args,
      data: {
        ...args.data,
        context: {
          ...((args.data?.context ?? {}) as any),
          documents: assignIdToDocuments((args.data?.context as any)?.documents),
        },
      },
    } as any);
  }

  async findMany<T extends Prisma.WorkflowRuntimeDataFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.workflowRuntimeData.findMany(
      this.scopeService.scopeFindMany(args, projectIds),
    );
  }

  async findOne<T extends Prisma.WorkflowRuntimeDataFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindFirstArgs>,
    projectIds: TProjectIds,
    transaction: PrismaTransaction | PrismaClient = this.prisma,
  ): Promise<WorkflowRuntimeData | null> {
    return await transaction.workflowRuntimeData.findFirst(
      this.scopeService.scopeFindOne(args, projectIds),
    );
  }

  async findByIdAndLock(
    id: string,
    projectIds: TProjectIds,
    transaction: PrismaTransaction | PrismaClient = this.prisma,
  ): Promise<WorkflowRuntimeData> {
    await transaction.$executeRaw`SELECT * FROM "WorkflowRuntimeData" WHERE "id" = ${id} AND "projectId" in (${projectIds?.join(
      ',',
    )}) FOR UPDATE`;

    return await transaction.workflowRuntimeData.findFirstOrThrow(
      this.scopeService.scopeFindFirst({ where: { id } }, projectIds),
    );
  }

  async findById<T extends Omit<Prisma.WorkflowRuntimeDataFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowRuntimeDataFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
    transaction: PrismaTransaction | PrismaClient = this.prisma,
  ): Promise<WorkflowRuntimeData> {
    return await transaction.workflowRuntimeData.findFirstOrThrow(
      this.scopeService.scopeFindOne(merge(args, { where: { id } }), projectIds),
    );
  }

  async findByIdAndLockUnscoped({
    id,
    transaction = this.prisma,
  }: {
    id: string;
    transaction: PrismaTransaction | PrismaClient;
  }): Promise<WorkflowRuntimeData> {
    await transaction.$executeRaw`SELECT * FROM "WorkflowRuntimeData" WHERE "id" = ${id} FOR UPDATE`;

    return await transaction.workflowRuntimeData.findFirstOrThrow({ where: { id } });
  }

  async updateById(
    id: string,
    args: {
      data: Omit<Prisma.WorkflowRuntimeDataUncheckedUpdateInput, StateRelatedColumns>;
    },
  ): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.update({
      where: { id },
      ...args,
    });
  }

  async updateStateById(
    id: string,
    { data }: { data: Prisma.WorkflowRuntimeDataUncheckedUpdateInput },
    transaction: PrismaTransaction,
  ): Promise<WorkflowRuntimeData> {
    return await transaction.workflowRuntimeData.update({
      where: { id },
      data: data,
    });
  }

  async updateRuntimeConfigById(
    id: string,
    newConfig: any,
    arrayMergeOption: ArrayMergeOption = 'by_id',
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData> {
    const stringifiedConfig = JSON.stringify(newConfig);
    const affectedRows = await this.prisma
      .$executeRaw`UPDATE "WorkflowRuntimeData" SET "config" = jsonb_deep_merge_with_options("config", ${stringifiedConfig}::jsonb, ${arrayMergeOption}) WHERE "id" = ${id} AND "projectId" in (${projectIds?.join(
      ',',
    )})`;

    // Retrieve and return the updated record
    if (affectedRows === 0) {
      throw new Error(`No workflowRuntimeData found with the id "${id}"`);
    }

    return this.findById(id, {}, projectIds);
  }

  async deleteById<T extends Omit<Prisma.WorkflowRuntimeDataDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowRuntimeDataDeleteArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.delete(
      this.scopeService.scopeDelete(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findActiveWorkflowByEntityAndLock(
    {
      entityId,
      entityType,
      workflowDefinitionId,
    }: {
      entityId: string;
      entityType: TEntityType;
      workflowDefinitionId: string;
    },
    projectIds: TProjectIds,
    transaction: PrismaTransaction,
  ) {
    if (entityType === 'endUser') {
      await transaction.$executeRaw`SELECT * FROM "WorkflowRuntimeData" WHERE "workflowDefinitionId" = ${workflowDefinitionId} AND "projectId" IN (${projectIds?.join(
        ',',
      )}) AND "status" != ${
        WorkflowRuntimeDataStatus.completed
      } AND "endUserId" = ${entityId} FOR UPDATE LIMIT 1`;
    } else {
      await transaction.$executeRaw`SELECT * FROM "WorkflowRuntimeData" WHERE "workflowDefinitionId" = ${workflowDefinitionId} AND "projectId" IN (${projectIds?.join(
        ',',
      )}) AND "status" != ${
        WorkflowRuntimeDataStatus.completed
      } AND "businessId" = ${entityId} FOR UPDATE LIMIT 1`;
    }

    return await this.findOne(
      {
        where: {
          workflowDefinitionId,
          [entityType]: {
            id: entityId,
          },
          status: {
            not: WorkflowRuntimeDataStatus.completed,
          },
        },
      },
      projectIds,
      transaction,
    );
  }

  async findContext(id: string, projectIds: TProjectIds) {
    return (
      await this.prisma.workflowRuntimeData.findFirstOrThrow(
        this.scopeService.scopeFindOne(
          {
            where: { id },
            select: {
              context: true,
            },
          },
          projectIds,
        ),
      )
    )?.context;
  }

  async count<T extends Prisma.WorkflowRuntimeDataFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<number> {
    return await this.prisma.workflowRuntimeData.count(
      this.scopeService.scopeFindMany(args, projectIds) as any,
    );
  }

  async groupBy<T extends Prisma.WorkflowRuntimeDataGroupByArgs>(
    args: Prisma.SubsetIntersection<T, Prisma.WorkflowRuntimeDataGroupByArgs, any>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.workflowRuntimeData.groupBy(
      this.scopeService.scopeGroupBy(args, projectIds),
    );
  }

  async search(
    {
      query: { search, entityType, workflowDefinitionIds, statuses },
      filters,
    }: {
      query: {
        search?: string;
        entityType: string;
        statuses: string[];
        workflowDefinitionIds?: string[];
      };
      filters?: {
        caseStatus?: string[];
        assigneeId?: Array<string | null>;
        status?: WorkflowRuntimeDataStatus[];
      };
    },
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData[]> {
    const { assigneeIds, includeUnassigned } = {
      assigneeIds: filters?.assigneeId?.filter((id): id is string => id !== null) ?? [],
      includeUnassigned: filters?.assigneeId?.includes(null),
    };

    const assigneeIdsParam = assigneeIds.length
      ? Prisma.join(assigneeIds.map(id => Prisma.sql`${id}`))
      : Prisma.sql``;

    const workflowDefinitionIdsParam = workflowDefinitionIds?.length
      ? Prisma.join(workflowDefinitionIds.map(id => Prisma.sql`${id}`))
      : Prisma.sql``;

    const statusesParam = statuses.length
      ? Prisma.join(statuses.map(status => Prisma.sql`${status}`))
      : Prisma.sql``;

    const projectIdsParam = projectIds?.length
      ? Prisma.join(projectIds.map(id => Prisma.sql`${id}`))
      : Prisma.sql``;

    const caseStatusParam = filters?.caseStatus?.length
      ? Prisma.join(filters.caseStatus.map(status => Prisma.sql`${status}`))
      : Prisma.sql``;

    const sql = Prisma.sql`
        SELECT id
        FROM search_workflow_data(
            ${search},
            ${entityType},
            array[${workflowDefinitionIdsParam}]::text[],
            array[${statusesParam}]::text[],
            array[${projectIdsParam}]::text[],
            array[${assigneeIdsParam}]::text[],
            array[${caseStatusParam}]::text[],
            ${includeUnassigned}::boolean
        )
    `;

    return (await this.prisma.$queryRaw(sql)) as WorkflowRuntimeData[];
  }

  async findLastActive(
    { workflowDefinitionId, businessId }: FindLastActiveFlowParams,
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData | null> {
    const query = this.projectScopeService.scopeFindOne(
      {
        orderBy: {
          createdAt: 'desc' as SortOrder,
        },
        where: {
          // status: 'active' as WorkflowRuntimeDataStatus,
          businessId,
          workflowDefinitionId,
        },
      },
      projectIds,
    );

    return await this.findOne(query, projectIds);
  }
}
