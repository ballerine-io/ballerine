import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, WorkflowRuntimeData, WorkflowRuntimeDataStatus } from '@prisma/client';
import { TEntityType } from '@/workflow/types';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { workflowRuntimeData, WorkflowRuntimeDataCreate } from '@/db/schema';
import merge from 'lodash/merge';

@Injectable()
export class WorkflowRuntimeDataRepository {
  db = db;

  constructor(protected readonly prisma: PrismaService) {}

  async create(data: WorkflowRuntimeDataCreate) {
    return await this.db
      .insert(workflowRuntimeData)
      .values({
        ...data,
        context: {
          ...(data?.context ?? {}),
          documents: assignIdToDocuments(data?.context?.documents),
        },
      })
      .returning();
  }

  async findMany(args?: Parameters<(typeof db)['query']['workflowRuntimeData']['findMany']>[0]) {
    return await this.db.query.workflowRuntimeData.findMany(args);
  }

  async findOne<T extends Prisma.WorkflowRuntimeDataFindFirstArgs>(
    args?: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindFirstArgs>,
  ): Promise<WorkflowRuntimeData | null> {
    return await this.prisma.workflowRuntimeData.findFirst(args);
  }

  async findById(
    id: string,
    args?: Omit<Parameters<(typeof db)['query']['workflowRuntimeData']['findFirst']>[0], 'where'>,
  ) {
    return await db.query.workflowRuntimeData.findFirst(
      merge(args, { where: eq(workflowRuntimeData.id, id) }),
    );
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

  async deleteById<T extends Omit<Prisma.WorkflowRuntimeDataDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowRuntimeDataDeleteArgs, 'where'>>,
  ): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.delete({
      where: { id },
      ...args,
    });
  }

  async findActiveWorkflowByEntity({
    entityId,
    entityType,
    workflowDefinitionId,
  }: {
    entityId: string;
    entityType: TEntityType;
    workflowDefinitionId: string;
  }) {
    return await this.findOne({
      where: {
        workflowDefinitionId,
        [entityType]: {
          id: entityId,
        },
        status: {
          not: WorkflowRuntimeDataStatus.completed,
        },
      },
    });
  }

  async getEntityTypeAndId(workflowRuntimeDataId: string) {
    return await this.findOne({
      where: {
        id: workflowRuntimeDataId,
      },
      select: {
        businessId: true,
        endUserId: true,
      },
    });
  }

  async findContext(id: string) {
    return (
      await this.prisma.workflowRuntimeData.findUniqueOrThrow({
        where: { id },
        select: {
          context: true,
        },
      })
    )?.context;
  }

  async count<T extends Prisma.WorkflowRuntimeDataFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindManyArgs>,
  ): Promise<number> {
    return await this.prisma.workflowRuntimeData.count(args);
  }

  async groupBy<T extends Prisma.WorkflowRuntimeDataGroupByArgs>(
    args: Prisma.SubsetIntersection<T, Prisma.WorkflowRuntimeDataGroupByArgs, any>,
  ) {
    return await this.prisma.workflowRuntimeData.groupBy(args);
  }

  async queryRaw<TValue>(query: string, values: any[] = []): Promise<TValue> {
    return (await this.prisma.$queryRawUnsafe.apply(this.prisma, [query, ...values])) as TValue;
  }
}
