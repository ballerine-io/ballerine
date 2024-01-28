import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@/transaction/transaction.repository';
import { TransactionCreateDto } from './dtos/transaction-create';
import { TransactionEntityMapper } from './transaction.mapper';
import { Prisma, Transaction } from '@prisma/client';
import { sleep } from '@ballerine/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export class TransactionService {
  constructor(
    protected readonly repository: TransactionRepository,
    protected readonly logger: AppLoggerService,
  ) {}

  async create(payload: TransactionCreateDto): Promise<Transaction> {
    const transactionEntity: Prisma.TransactionCreateInput = {
      ...TransactionEntityMapper.toEntity(payload),
      project: {
        connect: { id: payload.projectId },
      },
      // #TODO: fix types - this is a workaround, prisma defines jsonb's as prsima "json input"
      tags: payload.tags as any,
      auditTrail: payload.auditTrail as any,
      unusualActivityFlags: payload.unusualActivityFlags as any,
      additionalInfo: payload.additionalInfo as any,
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
      const transactionEntity: Prisma.TransactionCreateInput = {
        ...TransactionEntityMapper.toEntity(transaction),
        project: {
          connect: { id: transaction.projectId },
        },
        // #TODO: fix types - this is a workaround, prisma defines jsonb's as prsima "json input"
        tags: transaction.tags as any,
        auditTrail: transaction.auditTrail as any,
        unusualActivityFlags: transaction.unusualActivityFlags as any,
        additionalInfo: transaction.additionalInfo as any,
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

  // async list(args?: Parameters<TransactionRepository['findMany']>[0]) {
  //   return this.repository.findMany(args);
  // }

  // async getById(id: string, args?: Parameters<TransactionRepository['findById']>[1]) {
  //   return this.repository.findById(id, args);
  // }

  // async getByApiKey(apiKey: string) {
  //   return this.repository.findByApiKey(apiKey);
  // }

  // async getByProjectId(
  //   projectId: string,
  //   args?: Omit<Prisma.TransactionFindFirstArgsBase, 'where'>,
  // ) {
  //   return this.repository.findByProjectId(projectId, args);
  // }

  // async updateById(id: string, args: Parameters<TransactionRepository['updateById']>[1]) {
  //   return this.repository.updateById(id, args);
  // }

  // async deleteById(id: string, args?: Parameters<TransactionRepository['deleteById']>[1]) {
  //   return this.repository.deleteById(id, args);
  // }
}
