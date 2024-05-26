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

  async getAll(args: Parameters<TransactionRepository['findMany']>[0], projectId: string) {
    return this.repository.findMany(args, projectId);
  }

  async getTransactions(
    getTransactionsParameters: GetTransactionsDto,
    projectId: string,
    args?: Parameters<typeof this.repository.findManyWithFilters>[2],
  ) {
    return this.repository.findManyWithFilters(getTransactionsParameters, projectId, args);
  }
}
