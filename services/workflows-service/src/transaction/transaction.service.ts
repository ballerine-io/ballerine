import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@/transaction/transaction.repository';
import { TransactionCreateDto } from './dtos/transaction-create.dto';
import { TransactionEntityMapper } from './transaction.mapper';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import { TProjectId } from '@/types';
import { TransactionCreatedDto } from '@/transaction/dtos/transaction-created.dto';

@Injectable()
export class TransactionService {
  constructor(
    protected readonly repository: TransactionRepository,
    protected readonly logger: AppLoggerService,
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
        response.push({
          error: error instanceof Error ? error : new Error('Unknown error', { cause: error }),
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
