import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/customer/customer.repository';
import { Prisma } from '@prisma/client';
import { TCustomerWithFeatures } from '@/customer/types';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { generateHashedKey } from '@/customer/api-key/utils';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { PrismaService } from '@/prisma/prisma.service';
import { env } from '@/env';

@Injectable()
export class CustomerService {
  constructor(
    protected readonly repository: CustomerRepository,
    protected readonly apiKeyService: ApiKeyService,
    private readonly prisma: PrismaService,
  ) {}
  async create(args: Parameters<CustomerRepository['create']>[0]) {
    // @ts-expect-error - prisma json not updated
    const authValue = args.data?.authenticationConfiguration?.authValue;
    const { hashedKey, validUntil } = await generateHashedKey({ key: authValue });

    return await this.prisma.$transaction(async transaction => {
      const customer = await this.repository.create(
        {
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
        },
        transaction,
      );

      if (env.SYNC_UNIFIED_API === 'true') {
        await retry(() => new UnifiedApiClient().createCustomer(customer));
      }

      return customer;
    });
  }

  async list(args?: Parameters<CustomerRepository['findMany']>[0]) {
    return (await this.repository.findMany(args)) as unknown as TCustomerWithFeatures[];
  }

  async getById(id: string, args?: Parameters<CustomerRepository['findById']>[1]) {
    return (await this.repository.findById(id, args)) as unknown as TCustomerWithFeatures;
  }

  async getByName(name: string, args?: Parameters<CustomerRepository['findById']>[1]) {
    return (await this.repository.findByName(name, args)) as unknown as TCustomerWithFeatures;
  }

  async getByProjectId(projectId: string, args?: Omit<Prisma.CustomerFindFirstArgsBase, 'where'>) {
    return (await this.repository.findByProjectId(
      projectId,
      args,
    )) as unknown as TCustomerWithFeatures;
  }

  async updateById(id: string, args: Parameters<CustomerRepository['updateById']>[1]) {
    return await this.prisma.$transaction(async transaction => {
      const customer = (await this.repository.updateById(
        id,
        args,
        transaction,
      )) as unknown as TCustomerWithFeatures;

      if (env.SYNC_UNIFIED_API === 'true') {
        await retry(() => new UnifiedApiClient().updateCustomer(id, customer));
      }

      return customer;
    });
  }

  async deleteById(id: string, args?: Parameters<CustomerRepository['deleteById']>[1]) {
    return await this.prisma.$transaction(async transaction => {
      await this.repository.deleteById(id, args, transaction);

      if (env.SYNC_UNIFIED_API === 'true') {
        await retry(() => new UnifiedApiClient().deleteCustomer(id));
      }
    });
  }
}

const retry = async (fn: () => Promise<unknown>) => {
  const { default: pRetry } = await import('p-retry');

  return await pRetry(fn, {
    retries: 5,
    randomize: true,
    minTimeout: 100,
    maxTimeout: 10_000,
  });
};
