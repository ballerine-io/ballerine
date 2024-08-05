import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { TProjectId, TProjectIds } from '@/types';
import { Alert, Prisma } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class AlertRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.AlertCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertCreateArgs>,
  ): Promise<Alert> {
    return await this.prisma.alert.create<T>(args);
  }

  async findFirst<T extends Pick<Prisma.AlertFindFirstArgs, 'where'>>(
    args: Prisma.SelectSubset<T, Pick<Prisma.AlertFindFirstArgs, 'where'>>,
    projectIds: TProjectIds,
  ) {
    const queryArgs = this.scopeService.scopeFindFirst(args, projectIds);

    return await this.prisma.extendedClient.alert.findFirst({
      where: queryArgs.where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Method to find many alerts
  async findMany<T extends Prisma.AlertFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<Alert[]> {
    const queryArgs = this.scopeService.scopeFindMany(args, projectIds);

    return await this.prisma.alert.findMany(queryArgs);
  }

  // Method to find a single alert by ID
  async findById<T extends Pick<Prisma.AlertFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Pick<Prisma.AlertFindUniqueOrThrowArgs, 'where' | 'include'>>,
    projectIds: TProjectIds,
  ) {
    const queryArgs = this.scopeService.scopeFindOne(
      {
        ...args,
        where: {
          ...(args as Prisma.AlertFindFirstOrThrowArgs)?.where,
          id,
        },
      },
      projectIds,
    );

    return await this.prisma.alert.findUnique(queryArgs);
  }

  // Method to update an alerts
  async updateMany<T extends Omit<Prisma.AlertUpdateManyArgs, 'where'>>(
    alertIds: string[],
    projectId: TProjectId,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertUpdateManyArgs, 'where'>>,
  ): Promise<Alert[]> {
    if (!projectId) {
      throw new Error('Project ID is required to perform an update opeartion on Alerts');
    }

    const projectIds = [projectId];

    const queryArgs = this.scopeService.scopeFindMany(args, projectIds);

    const batchResponse = await this.prisma.alert.updateMany({
      ...queryArgs,
      where: {
        // @ts-expect-error - TS is not able to infer the type of where
        ...queryArgs.where,
        id: { in: alertIds },
      },
    });

    return batchResponse.count > 0
      ? await this.findMany({ where: { id: { in: alertIds } } }, projectIds)
      : [];
  }

  // Method to update an alert by ID
  async updateById<T extends Omit<Prisma.AlertUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertUpdateArgs, 'where'>>,
  ): Promise<Alert> {
    return await this.prisma.alert.update({
      where: { id },
      ...args,
    });
  }

  // // Method to delete an alert by ID
  // async deleteById<T extends Omit<Prisma.AlertDeleteArgs, 'where'>>(
  //   id: string,
  //   args: Prisma.SelectSubset<T, Omit<Prisma.AlertDeleteArgs, 'where'>>,
  //   projectIds: TProjectIds,
  // ): Promise<Alert> {
  //   return await this.prisma.alert.delete(
  //     this.scopeService.scopeDelete(
  //       {
  //         where: { id },
  //         ...args,
  //       },
  //       projectIds,
  //     ),
  //   );
  // }
}
