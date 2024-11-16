import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionRecord } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId } from '@/types';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import { DateTimeFilter } from '@/common/query-filters/date-time-filter';
import { toPrismaOrderByGeneric } from '@/workflow/utils/toPrismaOrderBy';
import deepmerge from 'deepmerge';

const DEFAULT_TRANSACTION_ORDER = {
  transactionDate: Prisma.SortOrder.desc,
};

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
    projectId: TProjectId,
    args?: Prisma.SelectSubset<T, Prisma.TransactionRecordFindManyArgs>,
  ) {
    return await this.prisma.transactionRecord.findMany(
      deepmerge(args || {}, this.scopeService.scopeFindMany(args, [projectId])),
    );
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  static buildTransactionOrderByArgs(getTransactionsParameters: GetTransactionsDto) {
    const args: {
      orderBy: Prisma.TransactionRecordFindManyArgs['orderBy'];
    } = {
      orderBy: getTransactionsParameters.orderBy
        ? toPrismaOrderByGeneric(getTransactionsParameters.orderBy)
        : DEFAULT_TRANSACTION_ORDER,
    };

    return args;
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  static buildTransactionPaginationArgs(getTransactionsParameters: GetTransactionsDto) {
    const args: {
      skip: Prisma.TransactionRecordFindManyArgs['skip'];
      take?: Prisma.TransactionRecordFindManyArgs['take'];
    } = {
      take: 20,
      skip: 0,
    };

    if (getTransactionsParameters.page?.number && getTransactionsParameters.page?.size) {
      // Temporary fix for pagination (class transformer issue)
      const size = parseInt(getTransactionsParameters.page.size as unknown as string, 10);
      const number = parseInt(getTransactionsParameters.page.number as unknown as string, 10);

      args.take = size;
      args.skip = size * (number - 1);
    }

    return args;
  }

  async findManyWithFilters(
    getTransactionsParameters: GetTransactionsDto,
    projectId: string,
    options?: Prisma.TransactionRecordFindManyArgs,
  ): Promise<TransactionRecord[]> {
    const args: Prisma.TransactionRecordFindManyArgs = {
      ...TransactionRepository.buildTransactionPaginationArgs(getTransactionsParameters),
      ...TransactionRepository.buildTransactionOrderByArgs(getTransactionsParameters),
    };

    return this.prisma.transactionRecord.findMany(
      this.scopeService.scopeFindMany(
        {
          ...options,
          where: {
            ...this.buildFiltersV1(getTransactionsParameters),
          },
          ...args,
        },
        [projectId],
      ),
    );
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  buildFiltersV1(
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

    return whereClause;
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  buildFiltersV2(
    projectId: TProjectId,
    getTransactionsParameters: GetTransactionsDto,
    args: Prisma.TransactionRecordWhereInput,
  ): Prisma.TransactionRecordWhereInput {
    const whereClause: Prisma.TransactionRecordWhereInput = {
      productId: projectId,
      transactionDate: {
        gte: getTransactionsParameters.startDate,
        lte: getTransactionsParameters.endDate,
      },
      paymentMethod: getTransactionsParameters.paymentMethod,
    };

    deepmerge(args, whereClause);

    return whereClause;
  }
}
