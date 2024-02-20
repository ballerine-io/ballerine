import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';
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
    const queryArgs = this.scopeService.scopeFindOne(
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

    return await this.prisma.alertDefinition.findFirstOrThrow(queryArgs);
  }
}
