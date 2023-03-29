import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, WorkflowRuntimeData } from '@prisma/client';

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
}
