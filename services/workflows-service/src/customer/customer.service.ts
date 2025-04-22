import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { generateHashedKey } from '@/customer/api-key/utils';
import { CustomerRepository } from '@/customer/customer.repository';
import { TCustomerWithFeatures } from '@/customer/types';
import { env } from '@/env';
import { MerchantMonitoringClient } from '@/merchant-monitoring/merchant-monitoring.client';
import { PrismaService } from '@/prisma/prisma.service';
import { AccessDetailsSchema, TAccessDetails, TAccessDetailsInput } from './schemas/zod-schemas';
import { AnalyticsService, EventNamesMap } from '@/common/analytics-logger/analytics.service';

@Injectable()
export class CustomerService {
  constructor(
    protected readonly repository: CustomerRepository,
    private readonly prismaService: PrismaService,
    private readonly analyticsService: AnalyticsService,
    private readonly merchantMonitoringClient: MerchantMonitoringClient,
  ) {}

  async getAccessDetails(customer: TCustomerWithFeatures): Promise<TAccessDetails> {
    const { id: customerId, config } = customer;

    const businessReportsCount = await this.merchantMonitoringClient.count({
      customerId,
      noExample: true,
    });

    const demoDetails: TAccessDetailsInput = {
      totalReports: businessReportsCount,
      maxBusinessReports: config.maxBusinessReports ?? 10,
      expiresAt: config.expiresAt,
    };

    if (!demoDetails.expiresAt) {
      const expiresAt = dayjs().add(env.DEFAULT_DEMO_DURATION_DAYS, 'days').unix();
      await this.updateById(customerId, { data: { config: { ...config, expiresAt } } });

      demoDetails.seenWelcomeModal = false;
      demoDetails.expiresAt = expiresAt;
    }

    return AccessDetailsSchema.parse(demoDetails);
  }

  async create(args: Parameters<CustomerRepository['create']>[0]) {
    // @ts-expect-error - prismaService json not updated
    const authValue = args.data?.authenticationConfiguration?.authValue;
    const { hashedKey, validUntil } = await generateHashedKey({ key: authValue });

    return await this.prismaService.$transaction(async transaction => {
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

      if (env.SYNC_UNIFIED_API) {
        await retry(() => new UnifiedApiClient().createCustomer(customer));
      }

      void this.analyticsService.trackSafe({
        event: EventNamesMap.CUSTOMER_CREATED,
        distinctId: customer.id,
        properties: {
          isDemoAccount: customer.config?.isDemoAccount,
          maxBusinessReports: customer.config?.maxBusinessReports,
        },
        customerId: customer.id,
      });

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
    return (await this.repository.findByProjectId(projectId, args)) as TCustomerWithFeatures;
  }

  async updateById(id: string, args: Parameters<CustomerRepository['updateById']>[1]) {
    return await this.prismaService.$transaction(async transaction => {
      const customer = (await this.repository.updateById(
        id,
        args,
        transaction,
      )) as unknown as TCustomerWithFeatures;

      if (env.SYNC_UNIFIED_API) {
        await retry(() => new UnifiedApiClient().updateCustomer(id, customer));
      }

      return customer;
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
