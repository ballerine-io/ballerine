import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, WorkflowRuntimeData, WorkflowRuntimeDataStatus } from '@prisma/client';
import { TEntityType } from '@/workflow/types';
import { merge } from 'lodash';
import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';

export type ArrayMergeOption = 'by_id' | 'by_index' | 'concat';

@Injectable()
export class WorkflowRuntimeDataRepository {
  constructor(protected readonly prisma: PrismaService) {}

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
    });
  }

  async findMany<T extends Prisma.WorkflowRuntimeDataFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindManyArgs>,
  ) {
    return await this.prisma.workflowRuntimeData.findMany(args);
  }

  async findOne<T extends Prisma.WorkflowRuntimeDataFindFirstArgs>(
    args?: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindFirstArgs>,
  ): Promise<WorkflowRuntimeData | null> {
    return await this.prisma.workflowRuntimeData.findFirst(args);
  }

  async findById<T extends Omit<Prisma.WorkflowRuntimeDataFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.WorkflowRuntimeDataFindUniqueOrThrowArgs, 'where'>>,
  ): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.findFirstOrThrow(merge(args, { where: { id } }));
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
  ): Promise<WorkflowRuntimeData> {
    const stringifiedContext = JSON.stringify(newContext);
    const affectedRows = await this.prisma
      .$executeRaw`UPDATE "WorkflowRuntimeData" SET "context" = jsonb_deep_merge_with_options("context", ${stringifiedContext}::jsonb, ${arrayMergeOption}) WHERE "id" = ${id}`;

    // Retrieve and return the updated record
    if (affectedRows === 0) {
      throw new Error(`No workflowRuntimeData found with the id "${id}"`);
    }

    return this.findById(id);
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
