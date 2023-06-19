import { Injectable } from '@nestjs/common';
import { BusinessRepository } from './business.repository';

@Injectable()
export class BusinessService {
  constructor(protected readonly repository: BusinessRepository) {}
  async create(args: Parameters<BusinessRepository['create']>[0]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.repository.create(args);
  }

  async list(args?: Parameters<BusinessRepository['findMany']>[0]) {
    return await this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<BusinessRepository['findById']>[1]) {
    return await this.repository.findById(id, args);
  }
}
