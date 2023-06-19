import { Injectable } from '@nestjs/common';
import { FilterRepository } from '@/filter/filter.repository';

@Injectable()
export class FilterService {
  constructor(protected readonly repository: FilterRepository) {}

  async create(args: Parameters<FilterRepository['create']>[0]) {
    return await this.repository.create(args);
  }

  async list(args?: Parameters<FilterRepository['findMany']>[0]) {
    return await this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<FilterRepository['findById']>[1]) {
    return await this.repository.findById(id, args);
  }
}
