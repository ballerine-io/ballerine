import { PrismaService } from '@/prisma/prisma.service';
import { assertIsValidProjectIds, ProjectScopeService } from '@/project/project-scope.service';
import type { PrismaTransaction, TProjectIds } from '@/types';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';
import { TEntityType, TWorkflowWithRelations } from '@/workflow/types';
import { toPrismaOrderBy } from '@/workflow/utils/toPrismaOrderBy';
import { ARRAY_MERGE_OPTION, ArrayMergeOption } from '@ballerine/workflow-core';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
  WorkflowRuntimeData,
  WorkflowRuntimeDataStatus,
} from '@prisma/client';
import { merge } from 'lodash';
import { WorkflowRuntimeDataActorService } from '@/workflow/workflow-runtime-data-actor.service';

/**
 * Columns that are related to the state of the workflow runtime data.
 * These columns should be excluded from regular update operations.
 */
type StateRelatedColumns = 'state' | 'status' | 'context' | 'tags';

@Injectable()
export class WorkflowRuntimeDataRepository {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly scopeService: ProjectScopeService,
    protected readonly actorService: WorkflowRuntimeDataActorService,
  ) {}

  async create<T extends Prisma.WorkflowRuntimeDataCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataCreateArgs>,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ): Promise<WorkflowRuntimeData> {
    return await transaction.workflowRuntimeData.create<T>({
      ...args,
      data: this.actorService.addActorIds({
        ...args.data,
        context: {
          ...((args.data?.context ?? {}) as any),
          documents: assignIdToDocuments((args.data?.context as any)?.documents),
        },
      }),
    } as any);
  }

  async findMany<T extends Prisma.WorkflowRuntimeDataFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prismaService.workflowRuntimeData.findMany(
      this.scopeService.scopeFindMany(args, projectIds),
    );
  }

  async findManyUnscoped<T extends Prisma.WorkflowRuntimeDataFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindManyArgs>,
  ) {
    return await this.prismaService.workflowRuntimeData.findMany(args);
  }

  async findOne<T extends Prisma.WorkflowRuntimeDataFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindFirstArgs>,
    projectIds: TProjectIds,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
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
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ): Promise<WorkflowRuntimeData> {
    return await transaction.workflowRuntimeData.findFirstOrThrow(
      this.scopeService.scopeFindOne(merge(args, { where: { id } }), projectIds),
    );
  }

  async findByIdWithRelations(id: string, projectIds: TProjectIds) {
    assertIsValidProjectIds(projectIds);

    const workflows = (await this.prismaService.$queryRaw`
        WITH workflows AS (
          SELECT
            CASE
              WHEN wrd.parent_runtime_data_id IS NULL THEN 'parent'
              ELSE 'child'
            END AS "workflowType",
            wrd.id,
            wrd.status,
            wrd."assigneeId",
            wrd."createdAt",
            wrd.context,
            wrd.state,
            wrd.tags,
            wrd."businessId",
            wrd."endUserId",
            wrd."workflowDefinitionId",
            wrd."projectId",
            CASE
              WHEN b.id IS NULL THEN NULL
              ELSE jsonb_build_object(
                'id',
                b.id,
                'companyName',
                b."companyName",
                'registrationNumber',
                b."registrationNumber",
                'legalForm',
                b."legalForm",
                'countryOfIncorporation',
                b."countryOfIncorporation",
                'dateOfIncorporation',
                b."dateOfIncorporation",
                'address',
                b.address,
                'phoneNumber',
                b."phoneNumber",
                'email',
                b.email,
                'website',
                b.website,
                'industry',
                b.industry,
                'taxIdentificationNumber',
                b."taxIdentificationNumber",
                'vatNumber',
                b."vatNumber",
                'shareholderStructure',
                b."shareholderStructure",
                'numberOfEmployees',
                b."numberOfEmployees",
                'businessPurpose',
                b."businessPurpose",
                'approvalState',
                b."approvalState",
                'createdAt',
                b."createdAt",
                'updatedAt',
                b."updatedAt"
              )
            END AS "business",
            CASE
              WHEN e.id IS NULL THEN NULL
              ELSE jsonb_build_object(
                'id',
                e.id,
                'correlationId',
                e."correlationId",
                'endUserType',
                e."endUserType",
                'approvalState',
                e."approvalState",
                'stateReason',
                e."stateReason",
                'firstName',
                e."firstName",
                'lastName',
                e."lastName",
                'email',
                e.email,
                'phone',
                e.phone,
                'dateOfBirth',
                e."dateOfBirth",
                'avatarUrl',
                e."avatarUrl",
                'additionalInfo',
                e."additionalInfo",
                'createdAt',
                e."createdAt",
                'updatedAt',
                e."updatedAt"
              )
            END AS "endUser",
            CASE
              WHEN wd.id IS NULL THEN NULL
              ELSE jsonb_build_object(
                'id',
                wd.id,
                'name',
                wd.name,
                'contextSchema',
                wd."contextSchema",
                'documentsSchema',
                wd."documentsSchema",
                'config',
                wd.config,
                'definition',
                wd.definition,
                'version',
                wd.version
              )
            END AS "workflowDefinition",
            CASE
              WHEN a.id IS NULL THEN NULL
              ELSE jsonb_build_object(
                'id',
                a.id,
                'firstName',
                a."firstName",
                'lastName',
                a."lastName",
                'avatarUrl',
                a."avatarUrl"
              )
            END AS "assignee"
          FROM
            "WorkflowRuntimeData" wrd
            JOIN "Project" p ON wrd."projectId" = p.id
            LEFT JOIN "WorkflowDefinition" wd ON wd.id = wrd."workflowDefinitionId"
            LEFT JOIN "Business" b ON b.id = wrd."businessId"
            AND wrd."businessId" IS NOT NULL
            LEFT JOIN "EndUser" e ON e.id = wrd."endUserId"
            AND wrd."endUserId" IS NOT NULL
            LEFT JOIN "User" a ON a.id = wrd."assigneeId"
            AND wrd."assigneeId" IS NOT NULL
          WHERE
            (
              wrd.id = ${id}
              OR wrd.parent_runtime_data_id = ${id}
            )
            AND wrd."projectId" = ${projectIds[0]}
        ),
        ubos AS (
          SELECT
            jsonb_array_elements(
              workflows.context -> 'entity' -> 'data' -> 'additionalInfo' -> 'ubos'
            ) AS ubos
          FROM
            workflows
        ),
        directors AS (
          SELECT
            jsonb_array_elements(
              workflows.context -> 'entity' -> 'data' -> 'additionalInfo' -> 'directors'
            ) AS directors
          FROM
            workflows
        ),
        individualBallerineIds AS (
          SELECT
            directors ->> 'ballerineEntityId' AS id
          FROM
            directors
          UNION
          ALL
          SELECT
            ubos ->> 'ballerineEntityId' AS id
          FROM
            ubos
        ),
        individuals AS (
          SELECT
            eu.id,
            eu."firstName",
            eu."lastName",
            eu.email,
            eu.gender,
            eu.nationality,
            eu.address,
            eu."dateOfBirth",
            eu.phone,
            eu."additionalInfo",
            eu."amlHits"
          FROM
            "EndUser" eu
            JOIN individualBallerineIds AS ibids ON ibids.id = eu.id
          WHERE
            eu."projectId" = ${projectIds[0]}
        )
        SELECT
          workflows.*,
          CASE
            WHEN workflows."workflowType" = 'parent' THEN indie.endUsers
            ELSE NULL
          END AS "endUsers"
        FROM
          workflows
          JOIN (
            SELECT
              jsonb_agg(individuals.*) AS endUsers
            FROM
              individuals
          ) AS indie ON TRUE
  `) as TWorkflowWithRelations[];

    const parentWorkflow = workflows.find(workflow => workflow.workflowType === 'parent');
    const childWorkflows = workflows.filter(workflow => workflow.workflowType === 'child');

    if (!parentWorkflow) {
      throw new NotFoundException(`A workflow with an id of "${id}" was not found`);
    }

    return {
      ...parentWorkflow,
      childWorkflowsRuntimeData: childWorkflows,
    };
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
    transaction = this.prismaService,
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
    transaction: PrismaTransaction | PrismaService = this.prismaService,
  ): Promise<WorkflowRuntimeData> {
    return await transaction.workflowRuntimeData.update({
      where: { id },
      data: this.actorService.addActorIds(args.data),
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
    transaction: PrismaTransaction = this.prismaService,
  ) {
    return await transaction.workflowRuntimeData.update({
      where: { id },
      data: this.actorService.addActorIds(data),
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
    const affectedRows = await this.prismaService
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
    return await this.prismaService.workflowRuntimeData.delete(
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
      await this.prismaService.workflowRuntimeData.findFirstOrThrow(
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
    return await this.prismaService.workflowRuntimeData.count(
      this.scopeService.scopeFindMany(args, projectIds) as any,
    );
  }

  async groupBy<T extends Prisma.WorkflowRuntimeDataGroupByArgs>(
    args: Prisma.SubsetIntersection<T, Prisma.WorkflowRuntimeDataGroupByArgs, any>,
    projectIds: TProjectIds,
  ) {
    return await this.prismaService.workflowRuntimeData.groupBy(
      this.scopeService.scopeGroupBy(args, projectIds),
    );
  }

  async findMainBusinessWorkflowRepresentative(
    {
      workflowRuntimeId,
      transaction,
    }: {
      workflowRuntimeId: string;
      transaction?: PrismaTransaction;
    },
    projectIds: TProjectIds,
  ) {
    const workflowSelectEndUserRepresentative = (await this.findById(
      workflowRuntimeId,
      {
        select: {
          business: {
            select: {
              id: true,
              endUsersOnBusinesses: {
                select: {
                  endUserId: true,
                },
              },
            },
          },
        },
      },
      projectIds,
      transaction,
    )) as unknown as {
      business: {
        endUsersOnBusinesses: Array<{
          endUserId: string;
        }>;
      };
    };

    return workflowSelectEndUserRepresentative.business?.endUsersOnBusinesses?.[0]?.endUserId;
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

    return (await this.prismaService.$queryRaw(sql)) as WorkflowRuntimeData[];
  }
}
