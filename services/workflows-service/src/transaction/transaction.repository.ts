import { PrismaService } from '../prisma/prisma.service';
import { TransactionRecord, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId } from '@/types';

@Injectable()
export class TransactionRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.TransactionRecordCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TransactionRecordCreateArgs>,
  ): Promise<TransactionRecord> {
    // #TODO: Fix this
    const { projectId, businessId, endUserId, ...rest } = args.data;

    args = {
      ...args,
      data: {
        ...rest,
        project: {
          connect: { id: projectId },
        },
      },
    } as any;

    // if (businessId) {
    //   args.data.business = {
    //     connect: { id: businessId },
    //   } as any;
    // }

    // if (endUserId) {
    //   args.data.endUser = {
    //     connect: { id: endUserId },
    //   } as any;
    // }
    const res = await this.prisma.transactionRecord.create<T>(args);

    return res;
  }

  async findMany<T extends Prisma.TransactionRecordFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.TransactionRecordFindManyArgs>,
    projectId: TProjectId,
  ) {
    return await this.prisma.transactionRecord.findMany(
      this.scopeService.scopeFindMany(args, [projectId]),
    );
  }
}
