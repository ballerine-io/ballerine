import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@/transaction/transaction.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(protected readonly repository: TransactionRepository) {}

  async create(args: Parameters<TransactionRepository['create']>[0]) {
    return this.repository.create(args);
  }

  async list(args?: Parameters<TransactionRepository['findMany']>[0]) {
    return this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<TransactionRepository['findById']>[1]) {
    return this.repository.findById(id, args);
  }

  async getByApiKey(apiKey: string) {
    return this.repository.findByApiKey(apiKey);
  }

  async getByProjectId(
    projectId: string,
    args?: Omit<Prisma.TransactionFindFirstArgsBase, 'where'>,
  ) {
    return this.repository.findByProjectId(projectId, args);
  }

  async updateById(id: string, args: Parameters<TransactionRepository['updateById']>[1]) {
    return this.repository.updateById(id, args);
  }

  async deleteById(id: string, args?: Parameters<TransactionRepository['deleteById']>[1]) {
    return this.repository.deleteById(id, args);
  }
}
