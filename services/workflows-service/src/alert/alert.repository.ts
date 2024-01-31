import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { TProjectIds } from '@/types';
import { Prisma, AlertExecution } from '@prisma/client';

@Injectable()
export class AlertRepository {
  constructor(protected readonly prisma: PrismaService) {}

  // Method to create an alert
  async create<T extends Prisma.AlertExecutionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertExecutionCreateArgs>,
  ): Promise<AlertExecution> {
    return await this.prisma.alertExecution.create<T>(args);
  }

  // // Method to find many alerts
  // async findMany<T extends Prisma.AlertExecutionFindManyArgs>(
  //   args: Prisma.SelectSubset<T, Prisma.AlertExecutionFindManyArgs>,
  //   projectIds: TProjectIds,
  // ): Promise<AlertExecution[]> {
  //   // const queryArgs = this.scopeService.scopeFindMany(args, projectIds);
  //   // return await this.prisma.alertExecution.findMany(queryArgs);
  // }

  // Method to find a single alert by ID
  async findById<T extends Omit<Prisma.AlertExecutionFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertExecutionFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<AlertExecution> {
    const queryArgs = args as Prisma.AlertExecutionFindFirstOrThrowArgs;
    queryArgs.where = {
      ...queryArgs.where,
      id,
      projectId: { in: projectIds! },
    };
    return await this.prisma.alertExecution.findFirstOrThrow(queryArgs);
  }

  // Method to update an alert by ID
  async updateById<T extends Omit<Prisma.AlertExecutionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertExecutionUpdateArgs, 'where'>>,
  ): Promise<AlertExecution> {
    return await this.prisma.alertExecution.update({
      where: { id },
      ...args,
    });
  }

  // // Method to delete an alert by ID
  // async deleteById<T extends Omit<Prisma.AlertExecutionDeleteArgs, 'where'>>(
  //   id: string,
  //   args: Prisma.SelectSubset<T, Omit<Prisma.AlertExecutionDeleteArgs, 'where'>>,
  //   projectIds: TProjectIds,
  // ): Promise<AlertExecution> {
  //   return await this.prisma.alertExecution.delete(
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
