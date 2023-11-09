import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, WorkflowRuntimeData, WorkflowRuntimeDataStatus } from '@prisma/client';
import { TEntityType } from '@/workflow/types';
import { merge } from 'lodash';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';
import { FindLastActiveFlowParams } from '@/workflow/types/params';
import { ProjectScopeService } from '@/project/project-scope.service';
import { SortOrder } from '@/common/query-filters/sort-order';
import { TProjectIds } from '@/types';

export type ArrayMergeOption = 'by_id' | 'by_index' | 'concat' | 'replace';

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
  ): Promise<WorkflowRuntimeData | null> {
    return await this.prisma.workflowRuntimeData.findFirst(
      this.scopeService.scopeFindOne(args, projectIds),
    );
  }

  async findById<T extends Omit<Prisma.WorkflowRuntimeDataFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowRuntimeDataFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.findFirstOrThrow(
      this.scopeService.scopeFindOne(merge(args, { where: { id } }), projectIds),
    );
  }

  async findByIdUnscoped(id: string): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.findFirstOrThrow({ where: { id } });
  }

  async updateById<T extends Omit<Prisma.WorkflowRuntimeDataUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowRuntimeDataUpdateArgs, 'where'>>,
  ): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.update({
      where: { id },
      ...args,
    });
  }

  async updateContextById(
    id: string,
    newContext: any,
    arrayMergeOption: ArrayMergeOption = 'by_id',
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData> {
    const stringifiedContext = JSON.stringify(newContext);
    const affectedRows = await this.prisma
      .$executeRaw`UPDATE "WorkflowRuntimeData" SET "context" = jsonb_deep_merge_with_options("context", ${stringifiedContext}::jsonb, ${arrayMergeOption}) WHERE "id" = ${id} AND "projectId" in (${projectIds?.join(
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

  async findActiveWorkflowByEntity(
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
  ) {
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
    );
  }

  async getEntityTypeAndId(workflowRuntimeDataId: string, projectIds: TProjectIds) {
    return await this.findOne(
      {
        where: {
          id: workflowRuntimeDataId,
        },
        select: {
          businessId: true,
          endUserId: true,
        },
      },
      projectIds,
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

  async queryRawUnscoped<TValue>(query: string, values: any[] = []): Promise<TValue> {
    return (await this.prisma.$queryRawUnsafe.apply(this.prisma, [query, ...values])) as TValue;
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

    const latestWorkflowRuntimeData = await this.findOne(query, projectIds);

    return latestWorkflowRuntimeData;
  }
}
