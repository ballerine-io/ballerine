import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, WorkflowRuntimeData, WorkflowRuntimeDataStatus } from '@prisma/client';
import { TEntityType } from '@/workflow/types';

@Injectable()
export class WorkflowRuntimeDataRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.WorkflowRuntimeDataCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataCreateArgs>,
  ): Promise<WorkflowRuntimeData> {
    return await this.prisma.workflowRuntimeData.create<T>(args);
  }

  async findMany<T extends Prisma.WorkflowRuntimeDataFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.WorkflowRuntimeDataFindManyArgs>,
  ): Promise<WorkflowRuntimeData[]> {
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
    return await this.prisma.workflowRuntimeData.findUniqueOrThrow({
      where: { id },
      ...args,
    });
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

  async getActiveWorkflowByEntity({
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
}
