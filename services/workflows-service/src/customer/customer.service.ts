import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/customer/customer.repository';
import { Prisma, Project } from '@prisma/client';
import { TCustomerWithDefinitionsFeatures } from '@/customer/types';
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
    return (await this.repository.findMany(args)) as unknown as TCustomerWithDefinitionsFeatures[];
  }

  async getById(id: string, args?: Parameters<CustomerRepository['findById']>[1]) {
    return (await this.repository.findById(
      id,
      args,
    )) as unknown as TCustomerWithDefinitionsFeatures;
  }

  async getByProjectId(projectId: string, args?: Omit<Prisma.CustomerFindFirstArgsBase, 'where'>) {
    return (await this.repository.findByProjectId(
      projectId,
      args,
    )) as unknown as TCustomerWithDefinitionsFeatures;
  }

  async updateById(id: string, args: Parameters<CustomerRepository['updateById']>[1]) {
    return (await this.repository.updateById(
      id,
      args,
    )) as unknown as TCustomerWithDefinitionsFeatures;
  }

  async deleteById(id: string, args?: Parameters<CustomerRepository['deleteById']>[1]) {
    return this.repository.deleteById(id, args);
  }
}
