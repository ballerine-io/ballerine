import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionRecord } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId } from '@/types';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import { DateTimeFilter } from '@/common/query-filters/date-time-filter';
import { toPrismaOrderByGeneric } from '@/workflow/utils/toPrismaOrderBy';

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
    getTransactionsParameters: GetTransactionsDto,
    projectId: string,
    options?: Prisma.TransactionRecordFindManyArgs,
  ): Promise<TransactionRecord[]> {
    const args: Prisma.TransactionRecordFindManyArgs = {};

    if (getTransactionsParameters.page?.number && getTransactionsParameters.page?.size) {
      // Temporary fix for pagination (class transformer issue)
      const size = parseInt(getTransactionsParameters.page.size as unknown as string, 10);
      const number = parseInt(getTransactionsParameters.page.number as unknown as string, 10);

      args.take = size;
      args.skip = size * (number - 1);
    }

    if (getTransactionsParameters.orderBy) {
      args.orderBy = toPrismaOrderByGeneric(getTransactionsParameters.orderBy);
    }

    return this.prisma.transactionRecord.findMany(
      this.scopeService.scopeFindMany(
        {
          ...options,
          where: {
            ...this.buildFilters(getTransactionsParameters),
          },
          ...args,
        },
        [projectId],
      ),
    );
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  private buildFilters(
    getTransactionsParameters: GetTransactionsDto,
  ): Prisma.TransactionRecordWhereInput {
    const whereClause: Prisma.TransactionRecordWhereInput = {};

    if (getTransactionsParameters.counterpartyId) {
      whereClause.OR = [
        { counterpartyOriginatorId: getTransactionsParameters.counterpartyId },
        { counterpartyBeneficiaryId: getTransactionsParameters.counterpartyId },
      ];
    }

    if (getTransactionsParameters.startDate) {
      whereClause.transactionDate = {
        ...(whereClause.transactionDate as DateTimeFilter),
        gte: getTransactionsParameters.startDate,
      };
    }

    if (getTransactionsParameters.endDate) {
      whereClause.transactionDate = {
        ...(whereClause.transactionDate as DateTimeFilter),
        lte: getTransactionsParameters.endDate,
      };
    }

    if (getTransactionsParameters.paymentMethod) {
      whereClause.paymentMethod = getTransactionsParameters.paymentMethod;
    }

    // Time filtering with client-provided UTC timestamps
    if (getTransactionsParameters.timeValue && getTransactionsParameters.timeUnit) {
      const now = new Date(); // UTC time by default
      let subtractValue = 0;

      switch (getTransactionsParameters.timeUnit) {
        case 'minutes':
          subtractValue = getTransactionsParameters.timeValue * 60 * 1000;
          break;
        case 'hours':
          subtractValue = getTransactionsParameters.timeValue * 60 * 60 * 1000;
          break;
        case 'days':
          subtractValue = getTransactionsParameters.timeValue * 24 * 60 * 60 * 1000;
          break;
        case 'months':
          now.setMonth(now.getMonth() - getTransactionsParameters.timeValue);
          break;
        case 'years':
          now.setFullYear(now.getFullYear() - getTransactionsParameters.timeValue);
          break;
      }

      const pastDate = new Date(now.getTime() - subtractValue);

      whereClause.transactionDate = { gte: pastDate };
    }

    return whereClause;
  }
}
