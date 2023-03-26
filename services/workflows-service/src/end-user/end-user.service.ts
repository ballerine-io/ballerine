import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EndUserRepository } from './end-user.repository';

@Injectable()
export class EndUserService {
  constructor(protected readonly repository: EndUserRepository) {}

  async list<T extends Prisma.EndUserFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.EndUserFindManyArgs>,
  ) {
    return await this.repository.findMany(args);
  }

  async getById(
    id: string,
    args?: Parameters<EndUserRepository['findById']>[1],
  ) {
    return await this.repository.findById(id, args);
  }
}
