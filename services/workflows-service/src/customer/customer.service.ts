import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/customer/customer.repository';
import { Prisma } from '@prisma/client';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { generateHashedKey } from '@/customer/api-key/utils';

@Injectable()
export class CustomerService {
  constructor(
    protected readonly repository: CustomerRepository,
    protected readonly apiKeyService: ApiKeyService,
  ) {}

  async create(args: Parameters<CustomerRepository['create']>[0]) {
    // @ts-expect-error - prisma json not updated
    const authValue = args.data?.authenticationConfiguration?.authValue;
    const { hashedKey, validUntil } = await generateHashedKey({ key: authValue });

    const dbCustomer = await this.repository.create({
      ...args,
      data: {
        ...args.data,
        apiKeys: {
          create: {
            hashedKey,
            validUntil,
          },
        },
      },
    });

    return dbCustomer;
  }

  async list(args?: Parameters<CustomerRepository['findMany']>[0]) {
    return this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<CustomerRepository['findById']>[1]) {
    return this.repository.findById(id, args);
  }

  async getByProjectId(projectId: string, args?: Omit<Prisma.CustomerFindFirstArgsBase, 'where'>) {
    return this.repository.findByProjectId(projectId, args);
  }

  async updateById(id: string, args: Parameters<CustomerRepository['updateById']>[1]) {
    return this.repository.updateById(id, args);
  }

  async deleteById(id: string, args?: Parameters<CustomerRepository['deleteById']>[1]) {
    return this.repository.deleteById(id, args);
  }
}
