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
import { ProjectScopeService } from '@/project/project-scope.service';
import type { PrismaTransaction, TProjectIds } from '@/types';
import { toPrismaOrderBy } from '@/workflow/utils/toPrismaOrderBy';
import { ARRAY_MERGE_OPTION, ArrayMergeOption } from '@ballerine/workflow-core';

/**
 * Columns that are related to the state of the workflow runtime data.
 * These columns should be excluded from regular update operations.
 */
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
    transaction: PrismaTransaction | PrismaClient = this.prisma,
  ): Promise<WorkflowRuntimeData> {
    return await transaction.workflowRuntimeData.create<T>({
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

  async findByIdAndLock<T extends Omit<Prisma.WorkflowRuntimeDataFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowRuntimeDataFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
    transaction: PrismaTransaction,
  ): Promise<WorkflowRuntimeData> {
    await this.lockWorkflowHierarchyForUpdate(Prisma.sql`"id" = ${id}`, projectIds, transaction);

    return await transaction.workflowRuntimeData.findFirstOrThrow(
      this.scopeService.scopeFindOne(merge(args, { where: { id } }), projectIds),
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

  /**
   * Locks the workflow hierarchy (including specified workflow runtime data, its parents, and children) to prevent concurrent modifications.
   * This function uses a recursive CTE to identify and lock all relevant rows within the transaction context, ensuring data integrity during updates.
   *
   * @param {Prisma.Sql} where - SQL condition to identify the anchor workflow runtime data records.
   * @param projectIds
   * @param transaction
   * @private
   */
  private async lockWorkflowHierarchyForUpdate(
    where: Prisma.Sql,
    projectIds: TProjectIds,
    transaction: PrismaTransaction,
  ): Promise<void> {
    await transaction.$executeRaw`WITH RECURSIVE "Hierarchy" AS (
        -- Anchor member: Select the target row along with a path tracking
        SELECT w1."id", ARRAY[w1."id"] AS path
        FROM "WorkflowRuntimeData" w1
        WHERE ${where}
        ${
          Array.isArray(projectIds)
            ? Prisma.sql`AND "projectId" in (${Prisma.join(projectIds)})`
            : Prisma.sql``
        }

        UNION ALL

        -- Recursive member: Select parents and children, avoiding cycles by checking the path
        SELECT w2."id", "Hierarchy".path || w2."id"
        FROM "WorkflowRuntimeData" w2
           JOIN "Hierarchy" ON w2."parent_runtime_data_id" = "Hierarchy"."id" OR "Hierarchy"."id" = w2."id"
        WHERE NOT w2."id" = ANY("Hierarchy".path) -- Prevent revisiting nodes
      )
      SELECT w.*
      FROM "WorkflowRuntimeData" w
      INNER JOIN "Hierarchy" ir ON w."id" = ir."id"
      FOR UPDATE`;
  }

  async findByIdAndLockUnscoped({
    id,
    transaction = this.prisma,
  }: {
    id: string;
    transaction: PrismaTransaction | PrismaClient;
  }): Promise<WorkflowRuntimeData> {
    await this.lockWorkflowHierarchyForUpdate(Prisma.sql`"id" = ${id}`, null, transaction);

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
    {
      data,
      include = undefined,
    }: {
      data: Prisma.WorkflowRuntimeDataUncheckedUpdateInput;
      include?: Prisma.WorkflowRuntimeDataInclude;
    },
    transaction: PrismaTransaction,
  ) {
    return await transaction.workflowRuntimeData.update({
      where: { id },
      data,
      include,
    });
  }

  async updateRuntimeConfigById(
    id: string,
    newConfig: any,
    arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID,
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
    let query: Prisma.Sql;

    switch (entityType) {
      case 'endUser':
        query = Prisma.sql`"status" != 'completed' AND "endUserId" = ${entityId}`;
        break;
      case 'business':
        query = Prisma.sql`"status" != 'completed' AND "businessId" = ${entityId}`;
        break;
      default:
        entityType satisfies never;
        throw new Error(`Unsupported entity type: ${entityType}`);
    }

    await this.lockWorkflowHierarchyForUpdate(query, null, transaction);

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
      query: { search, take, skip, entityType, workflowDefinitionIds, statuses, orderBy },
      filters,
    }: {
      query: {
        take: number;
        skip: number;
        search?: string;
        entityType: string;
        statuses: string[];
        workflowDefinitionIds?: string[];
        orderBy: Parameters<typeof toPrismaOrderBy>[0];
      };
      filters?: {
        caseStatus?: string[];
        assigneeId?: Array<string | null>;
        status?: WorkflowRuntimeDataStatus[];
      };
    },
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData[]> {
    const [orderByColumn, orderByDirection] = orderBy.split(':');

    const { assigneeIds, includeUnassigned } = {
      assigneeIds: filters?.assigneeId?.filter((id): id is string => id !== null) ?? [],
      includeUnassigned: filters?.assigneeId?.includes(null) || false,
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
            ${search}::text,
            ${entityType}::text,
            ${orderByColumn}::text,
            ${orderByDirection}::text,
            array[${workflowDefinitionIdsParam}]::text[],
            array[${statusesParam}]::text[],
            array[${projectIdsParam}]::text[],
            array[${assigneeIdsParam}]::text[],
            array[${caseStatusParam}]::text[],
            ${includeUnassigned}::boolean
        )
        LIMIT ${take} OFFSET ${skip}
    `;

    return (await this.prisma.$queryRaw(sql)) as WorkflowRuntimeData[];
  }
}
