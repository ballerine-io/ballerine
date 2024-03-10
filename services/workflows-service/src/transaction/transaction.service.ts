import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@/transaction/transaction.repository';
import { TransactionCreateDto } from './dtos/transaction-create.dto';
import { TransactionEntityMapper } from './transaction.mapper';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import { TProjectId } from '@/types';
import { TransactionCreatedDto } from '@/transaction/dtos/transaction-created.dto';
import { Prisma } from '@prisma/client';
import { SentryService } from '@/sentry/sentry.service';

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
    const response: Array<TransactionCreatedDto | { error: Error; correlationId: string }> = [];

    for (const transactionPayload of transactionsPayload) {
      try {
        const transaction = await this.repository.create({
          data: TransactionEntityMapper.toCreateData({
            dto: transactionPayload,
            projectId,
          }),
        });

        response.push({
          id: transaction.id,
          correlationId: transaction.transactionCorrelationId,
        });
      } catch (error) {
        let errorToLog: Error = new Error('Unknown error', { cause: error });

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          errorToLog = new Error('Transaction already exists', { cause: error });
        } else {
          this.sentry.captureException(errorToLog);
        }

        response.push({
          error: errorToLog,
          correlationId: transactionPayload.correlationId,
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
