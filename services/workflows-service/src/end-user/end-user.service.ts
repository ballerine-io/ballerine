import { Injectable } from '@nestjs/common';
import { EndUserRepository } from './end-user.repository';

@Injectable()
export class EndUserService {
  constructor(protected readonly repository: EndUserRepository) {}

  async create(args: Parameters<EndUserRepository['create']>[0]) {
    const endUser = {
      ...args,
      Entity: {
        create: {
          entityType: 'EndUser', // or whatever your EntityType enum is
        },
      },
    }

    return await this.repository.create(endUser);
  }

  async list(args?: Parameters<EndUserRepository['findMany']>[0]) {
    return await this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<EndUserRepository['findById']>[1]) {
    return await this.repository.findById(id, args);
  }
}
