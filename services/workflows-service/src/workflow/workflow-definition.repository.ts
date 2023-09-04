import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectIds } from '@/types';
import { Injectable } from '@nestjs/common';
import { Prisma, WorkflowDefinition } from '@prisma/client';

@Injectable()
export class WorkflowDefinitionRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.WorkflowDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCreateArgs>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.create<T>(
      this.scopeService.scopeCreate(args, projectIds),
    );
  }

  async findMany<T extends Prisma.WorkflowDefinitionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition[]> {
    return await this.prisma.workflowDefinition.findMany(
      this.scopeService.scopeFindMany(args, projectIds),
    );
  }

  async findById<T extends Omit<Prisma.WorkflowDefinitionFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindUniqueOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.findUniqueOrThrow(
      this.scopeService.scopeFindOne(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findTemplateByIdUnscoped<
    T extends Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>,
  >(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>,
    projectId?: string,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.findFirstOrThrow({
      where: { id, isPublic: true, projectId: projectId ?? null },
      ...args,
    });
  }

  async updateById<T extends Omit<Prisma.WorkflowDefinitionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionUpdateArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.update(
      this.scopeService.scopeUpdate(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async deleteById<T extends Omit<Prisma.WorkflowDefinitionDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionDeleteArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.delete(
      this.scopeService.scopeDelete(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }
}
