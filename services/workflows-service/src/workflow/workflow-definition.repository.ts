import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId, TProjectIds } from '@/types';
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
    projectId?: TProjectId,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.create<T>(
      this.scopeService.scopeCreate(args, projectId),
    );
  }

  async createUnscoped<T extends Prisma.WorkflowDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCreateArgs>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.create<T>(args);
  }

  async findMany<T extends Prisma.WorkflowDefinitionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition[]> {
    const queryArgs = this.scopeService.scopeFindMany(args, projectIds);

    if (args.where?.projectId) {
      queryArgs.where = {
        OR: [
          {
            ...queryArgs.where,
          },
          {
            ...queryArgs.where,
            project: { is: null },
            isPublic: true,
          },
        ],
      };
    }

    return await this.prisma.workflowDefinition.findMany(queryArgs);
  }

  async findById<T extends Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition> {
    const queryArgs = args as Prisma.WorkflowDefinitionFindFirstOrThrowArgs;

    queryArgs.where = {
      ...queryArgs.where,
      id,
      OR: [
        {
          projectId: null,
          isPublic: true,
        },
        {
          project: { id: { in: projectIds! } },
        },
      ],
    };
    return await this.prisma.workflowDefinition.findFirstOrThrow(queryArgs);
  }

  async findTemplateByIdUnscoped<
    T extends Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>,
  >(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.findFirstOrThrow({
      where: { id, isPublic: true },
      ...args,
    });
  }

  async findByIdUnscoped<T extends Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.findFirstOrThrow({
      where: { id },
      ...args,
    });
  }

  async updateById<T extends Omit<Prisma.WorkflowDefinitionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionUpdateArgs, 'where'>>,
    projectId: TProjectId,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.update(
      this.scopeService.scopeUpdate(
        {
          where: { id },
          ...args,
        },
        projectId,
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
