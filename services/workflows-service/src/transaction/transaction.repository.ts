import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionRecord } from '@prisma/client';
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
  ) {
    return await this.prisma.transactionRecord.create<T>(args);
  }

  async findMany<T extends Prisma.TransactionRecordFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.TransactionRecordFindManyArgs>,
    projectId: TProjectId,
  ) {
    return await this.prisma.transactionRecord.findMany(
      this.scopeService.scopeFindMany(args, [projectId]),
    );
  }

  async findManyWithFilters(
    // getTransactionsParameters: Parameters<typeof this.buildFilters>[0],
    projectId: string,
    options?: Prisma.TransactionRecordFindManyArgs,
  ): Promise<TransactionRecord[]> {
    return this.prisma.transactionRecord.findMany(
      this.scopeService.scopeFindMany(
        {
          ...options,
          where: {
            ...((options || {}).where || {}),
          },
        },
        [projectId],
      ),
    );
  }
}
