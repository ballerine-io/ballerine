import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { TProjectIds } from '@/types';
import { Prisma, Alert } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class AlertRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  // Method to create an alert
  async create<T extends Prisma.AlertCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertCreateArgs>,
  ): Promise<Alert> {
    return await this.prisma.alert.create<T>(args);
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
  async findById<T extends Omit<Prisma.AlertFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<Alert> {
    const queryArgs = args as Prisma.AlertFindFirstOrThrowArgs;
    queryArgs.where = {
      ...queryArgs.where,
      id,
      projectId: { in: projectIds! },
    };
    return await this.prisma.alert.findFirstOrThrow(queryArgs);
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
