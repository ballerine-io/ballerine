import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { TProjectIds } from '@/types';
import { AlertDefinition, Prisma } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class AlertDefinitionRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async findByAlertId<T extends Omit<Prisma.AlertDefinitionFindFirstOrThrowArgs, 'where'>>(
    alertId: string,
    projectIds: TProjectIds,
    args?: Prisma.SelectSubset<T, Omit<Prisma.AlertDefinitionFindFirstOrThrowArgs, 'where'>>,
  ) {
    return this.findFirst(
      {
        ...args,
        where: {
          alert: {
            some: {
              id: alertId,
            },
          },
        },
      },
      projectIds,
    );
  }

  async create<T extends Prisma.AlertDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertDefinitionCreateArgs>,
  ): Promise<AlertDefinition> {
    return await this.prisma.alertDefinition.create<T>(args);
  }

  async findFirst<T extends Prisma.AlertDefinitionFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertDefinitionFindFirstArgs>,
    projectIds: TProjectIds,
  ): Promise<AlertDefinition> {
    const queryArgs = this.scopeService.scopeFindFirst(args, projectIds);

    return await this.prisma.alertDefinition.findFirstOrThrow(queryArgs);
  }

  async findMany<T extends Prisma.AlertDefinitionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertDefinitionFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<AlertDefinition[]> {
    const queryArgs = this.scopeService.scopeFindMany(args, projectIds);

    return await this.prisma.alertDefinition.findMany(queryArgs);
  }

  async findById<T extends Omit<Prisma.AlertDefinitionFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertDefinitionFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<AlertDefinition> {
    const queryArgs = this.scopeService.scopeFindOne(
      {
        ...args,
        where: {
          ...(args as Prisma.AlertDefinitionFindFirstOrThrowArgs)?.where,
          id,
        },
      },
      projectIds,
    );

    return await this.prisma.alertDefinition.findFirstOrThrow(queryArgs);
  }

  async updateById<T extends Omit<Prisma.AlertDefinitionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertDefinitionUpdateArgs, 'where'>>,
  ): Promise<AlertDefinition> {
    return await this.prisma.alertDefinition.update({
      where: { id },
      ...args,
    });
  }

  async deleteById<T extends Omit<Prisma.AlertDefinitionDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertDefinitionDeleteArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<AlertDefinition> {
    return await this.prisma.alertDefinition.delete(
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
