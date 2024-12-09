import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@/transaction/transaction.repository';
import { TransactionCreateDto } from './dtos/transaction-create.dto';
import { TransactionEntityMapper } from './transaction.mapper';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import { TProjectId } from '@/types';
import { TransactionCreatedDto } from '@/transaction/dtos/transaction-created.dto';
import { SentryService } from '@/sentry/sentry.service';
import { isPrismaClientKnownRequestError } from '@/prisma/prisma.util';
import { getErrorMessageFromPrismaError } from '@/common/filters/HttpExceptions.filter';
import { PageDto } from '@/common/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    protected readonly repository: TransactionRepository,
    protected readonly logger: AppLoggerService,
    private readonly sentry: SentryService,
  ) {}

  async createBulk({
    transactionsPayload,
    projectId,
  }: {
    transactionsPayload: TransactionCreateDto[];
    projectId: TProjectId;
  }) {
    const mappedTransactions = transactionsPayload.map(transactionPayload =>
      TransactionEntityMapper.toCreateData({
        dto: transactionPayload,
        projectId,
      }),
    );

    const response: Array<TransactionCreatedDto | { errorMessage: string; correlationId: string }> =
      [];

    for (const transactionPayload of mappedTransactions) {
      const correlationId = transactionPayload.transactionCorrelationId;
      try {
        const transaction = await this.repository.create({ data: transactionPayload });

        response.push({
          id: transaction.id,
          correlationId,
        });
      } catch (error) {
        if (mappedTransactions.length === 1) {
          throw error;
        }

        let errorMessage = 'Unknown error';

        if (isPrismaClientKnownRequestError(error)) {
          errorMessage = getErrorMessageFromPrismaError(error);
        } else {
          this.sentry.captureException(error as Error);
          this.logger.error(error as Error);
        }

        response.push({
          errorMessage,
          correlationId: transactionPayload.transactionCorrelationId,
        });
      }
    }

    return response;
  }

  async getTransactionsV1(
    filters: GetTransactionsDto,
    projectId: string,
    args?: Parameters<typeof this.repository.findManyWithFiltersV1>[2],
  ) {
    return this.repository.findManyWithFiltersV1(filters, projectId, args);
  }

  async getTransactions(
    projectId: string,
    sortAndPageParams?: {
      orderBy?: `${string}:asc` | `${string}:desc`;
      page: PageDto;
    },
    args?: Parameters<typeof this.repository.findMany>[1],
  ) {
    const sortAndPageArgs: Prisma.TransactionRecordFindManyArgs = {
      ...TransactionRepository.buildTransactionPaginationArgs(sortAndPageParams),
      ...TransactionRepository.buildTransactionOrderByArgs(sortAndPageParams),
    };

    return this.repository.findMany(projectId, { ...args, ...sortAndPageArgs });
  }
}
