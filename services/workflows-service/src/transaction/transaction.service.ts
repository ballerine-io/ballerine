import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@/transaction/transaction.repository';
import { TransactionCreateDto } from './dtos/transaction-create.dto';
import { TransactionEntityMapper } from './transaction.mapper';
import { Prisma, TransactionRecord } from '@prisma/client';
import { sleep } from '@ballerine/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { GetTransactionsDto } from './dtos/get-transactions.dto';

@Injectable()
export class TransactionService {
  constructor(
    protected readonly repository: TransactionRepository,
    protected readonly logger: AppLoggerService,
  ) {}

  async create(payload: TransactionCreateDto): Promise<TransactionRecord> {
    const transactionEntity: Prisma.TransactionRecordCreateInput = {
      ...TransactionEntityMapper.toEntity(payload),
      project: {
        connect: { id: payload.projectId },
      },
      // #TODO: fix types - this is a workaround, prisma defines jsonb's as prsima "json input"
      tags: payload.tags as any,
      auditTrail: payload.auditTrail as any,
      unusualActivityFlags: payload.unusualActivityFlags as any,
      additionalInfo: payload.additionalInfo as any,
      transactionCorrelationId: '',
      transactionDate: '',
      transactionAmount: 0,
      transactionCurrency: '',
    };

    return this.repository.create({ data: transactionEntity });
  }

  async createBatch(payload: TransactionCreateDto[]): Promise<{
    txCreationResponse: {
      txid: string;
      status: 'success' | 'failed';
      txCorrelationId: string;
      errorMessage?: string;
    }[];
    overallStatus: 'success' | 'partial';
  }> {
    // TEMP IMPLEMENTATION - REMOVE WHEN TASK BASED BATCH CREATE IS IMPLEMENTED

    const txCreationResponse: {
      txid: string;
      status: 'success' | 'failed';
      txCorrelationId: string;
      errorMessage?: string;
    }[] = [];
    let overallStatus: 'success' | 'partial' = 'success';

    for (const transaction of payload) {
      const transactionEntity: Prisma.TransactionRecordCreateInput = {
        ...TransactionEntityMapper.toEntity(transaction),
        project: {
          connect: { id: transaction.projectId },
        },
        // #TODO: fix types - this is a workaround, prisma defines jsonb's as prsima "json input"
        tags: transaction.tags as any,
        auditTrail: transaction.auditTrail as any,
        unusualActivityFlags: transaction.unusualActivityFlags as any,
        additionalInfo: transaction.additionalInfo as any,
        transactionCorrelationId: '',
        transactionDate: '',
        transactionAmount: 0,
        transactionCurrency: '',
      };

      await sleep(200);

      let res;
      try {
        res = await this.repository.create({ data: transactionEntity });
        txCreationResponse.push({
          txid: res.id,
          txCorrelationId: transaction.correlationId,
          status: 'success',
        });
      } catch (error: unknown) {
        overallStatus = 'partial';

        txCreationResponse.push({
          txid: res?.id ?? '',
          status: 'failed',
          txCorrelationId: transaction.correlationId,
          errorMessage: (error as Error).message ?? '',
        });
      }
    }
    this.logger.log('txCreationResponse', txCreationResponse);

    return { txCreationResponse, overallStatus };
  }

  async getAll(args: Parameters<TransactionRepository['findMany']>[0], projectId: string) {
    return this.repository.findMany(args, projectId);
  }

  async getTransactions(getTransactionsParameters: GetTransactionsDto, projectId: string) {
    return this.repository.findManyWithFilters(getTransactionsParameters, projectId);
  }
}
