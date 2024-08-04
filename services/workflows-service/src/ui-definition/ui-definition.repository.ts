import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectIds } from '@/types';
import { Injectable } from '@nestjs/common';
import { Prisma, UiDefinition, UiDefinitionContext } from '@prisma/client';

@Injectable()
export class UiDefinitionRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.UiDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UiDefinitionCreateArgs>,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.create<T>(args);
  }

  async findById<T extends Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.findFirstOrThrow(
      this.scopeService.scopeFindFirst(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findByArgs(args: Prisma.UiDefinitionFindFirstOrThrowArgs, projectIds: TProjectIds) {
    return await this.prisma.uiDefinition.findFirstOrThrow(
      this.scopeService.scopeFindFirst(args, projectIds),
    );
  }

  async findByWorkflowDefinitionId(
    workflowDefinitionId: string,
    uiContext: keyof typeof UiDefinitionContext,
    projectIds: TProjectIds,
    args?: Prisma.UiDefinitionFindFirstOrThrowArgs,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.findFirstOrThrow(
      this.scopeService.scopeFindFirst(
        {
          ...args,
          where: {
            or: [
              {
                workflowDefinitionId,
                uiContext: uiContext,
              },
              ...(args?.where ? [args.where] : []),
            ],
          },
        },
        projectIds,
      ),
    );
  }

  async updateById<T extends Omit<Prisma.UiDefinitionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UiDefinitionUpdateArgs, 'where'>>,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.update({
      where: { id },
      ...args,
    });
  }

  async deleteById<T extends Omit<Prisma.UiDefinitionDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UiDefinitionDeleteArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.delete(
      this.scopeService.scopeDelete(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findMany<T extends Prisma.UiDefinitionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.UiDefinitionFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<UiDefinition[]> {
    return await this.prisma.uiDefinition.findMany(
      this.scopeService.scopeFindMany(args, projectIds),
    );
  }

  async update(args: Prisma.UiDefinitionUpdateArgs, projectIds: TProjectIds) {
    return await this.prisma.uiDefinition.updateMany(
      //@ts-ignore
      this.scopeService.scopeUpdateMany(args, projectIds),
    );
  }
}
