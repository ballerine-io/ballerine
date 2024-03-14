import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectIds } from '@/types';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, WorkflowDefinition } from '@prisma/client';
import { validateDefinitionLogic } from '@ballerine/workflow-core';
import { PrismaTransaction } from '@/types';

@Injectable()
export class WorkflowDefinitionRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.WorkflowDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCreateArgs>,
  ): Promise<WorkflowDefinition> {
    validateDefinitionLogic(args.data);

    return await this.prisma.workflowDefinition.create<T>(args);
  }

  async createUnscoped<T extends Prisma.WorkflowDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCreateArgs>,
  ): Promise<WorkflowDefinition> {
    validateDefinitionLogic(args.data);

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
            projectId: null,
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
    transaction: PrismaTransaction | PrismaClient = this.prisma,
  ): Promise<WorkflowDefinition> {
    const queryArgs = args as Prisma.WorkflowDefinitionFindFirstOrThrowArgs;

    queryArgs.where = {
      ...queryArgs.where,
      OR: [
        {
          id,
          projectId: null,
          isPublic: true,
        },
        {
          AND: [{ id, project: { id: { in: projectIds! } } }],
        },
      ],
    };

    return await transaction.workflowDefinition.findFirstOrThrow(queryArgs);
  }

  async findTemplateByIdUnscoped<
    T extends Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>,
  >(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.findFirstOrThrow({
      where: { id, isPublic: true },
      ...args,
    });
  }

  async updateById<T extends Omit<Prisma.WorkflowDefinitionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionUpdateArgs, 'where'>>,
  ): Promise<WorkflowDefinition> {
    args.data.definition && validateDefinitionLogic(args.data);

    return await this.prisma.workflowDefinition.update({
      where: { id },
      ...args,
    });
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

  async findByLatestVersion(name: string, projectIds: TProjectIds) {
    return await this.prisma.workflowDefinition.findFirstOrThrow({
      where: {
        OR: [
          {
            name,
            projectId: { in: projectIds },
          },
          {
            name,
            projectId: null,
            isPublic: true,
          },
        ],
      },
      orderBy: { version: 'desc' },
    });
  }
}
