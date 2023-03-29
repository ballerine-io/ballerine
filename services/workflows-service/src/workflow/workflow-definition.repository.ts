import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, WorkflowDefinition } from '@prisma/client';

@Injectable()
export class WorkflowDefinitionRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.WorkflowDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCreateArgs>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.create<T>(args);
  }

  async findMany<T extends Prisma.WorkflowDefinitionFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionFindManyArgs>,
  ): Promise<WorkflowDefinition[]> {
    return await this.prisma.workflowDefinition.findMany(args);
  }

  async findById<T extends Omit<Prisma.WorkflowDefinitionFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindUniqueOrThrowArgs, 'where'>>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async updateById<T extends Omit<Prisma.WorkflowDefinitionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionUpdateArgs, 'where'>>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.update({
      where: { id },
      ...args,
    });
  }

  async deleteById<T extends Omit<Prisma.WorkflowDefinitionDeleteArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionDeleteArgs, 'where'>>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.delete({
      where: { id },
      ...args,
    });
  }
}
