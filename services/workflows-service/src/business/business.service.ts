import { CompanyInformationModel } from '@/business/models/company-information.module';
import {
  FetchCompanyInformationParams,
  TCompanyInformation,
} from '@/business/types/business-information';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { TCustomerWithFeatures } from '@/customer/types';
import { env } from '@/env';
import type { PrismaTransaction, TProjectIds } from '@/types';
import { HttpService } from '@nestjs/axios';
import * as common from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Business } from '@prisma/client';
import { AxiosError } from 'axios';
import { plainToClass } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { BusinessRepository } from './business.repository';
import { CustomerService } from '@/customer/customer.service';
import {
  BusinessPayload,
  UnifiedApiClient,
} from '@/common/utils/unified-api-client/unified-api-client';
import { PrismaService } from '@/prisma/prisma.service';
import { beginTransactionIfNotExistCurry } from '@/prisma/prisma.util';

@Injectable()
export class BusinessService {
  private readonly unifiedApiClient = new UnifiedApiClient();

  constructor(
    protected readonly repository: BusinessRepository,
    protected readonly logger: AppLoggerService,
    protected readonly httpService: HttpService,
    protected readonly customerService: CustomerService,
    private readonly prisma: PrismaService,
  ) {}

  async create(args: Parameters<BusinessRepository['create']>[0], transaction?: PrismaTransaction) {
    return await beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prisma,
    })(async tx => {
      const business = await this.repository.create(args, tx);

      const businessPayload = (await this.repository.findByIdUnscoped(
        business.id,
        {
          select: {
            id: true,
            correlationId: true,
            companyName: true,
            metadata: true,
            createdAt: true,
            updatedAt: true,
            project: {
              select: {
                customer: {
                  select: {
                    id: true,
                    config: true,
                  },
                },
              },
            },
          },
        },
        tx,
      )) as unknown as BusinessPayload;

      if (env.SYNC_UNIFIED_API) {
        await retry(() => this.unifiedApiClient.createOrUpdateBusiness(businessPayload));
      }

      return business;
    });
  }

  async list(args: Parameters<BusinessRepository['findMany']>[0], projectIds: TProjectIds) {
    return (await this.repository.findMany(args, projectIds)) as Array<
      Business & {
        metadata?: {
          featureConfig?: TCustomerWithFeatures['features'];
          lastOngoingReportInvokedAt?: number;
        };
      }
    >;
  }

  async getById(
    id: string,
    args: Parameters<BusinessRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.repository.findById(id, args, projectIds);
  }

  async getByIdUnscoped(id: string, args: Parameters<BusinessRepository['findByIdUnscoped']>[1]) {
    return await this.repository.findByIdUnscoped(id, args);
  }

  async getByCorrelationId(
    correlationId: string,
    projectids: TProjectIds,
    args?: Parameters<BusinessRepository['findByCorrelationId']>[2],
  ) {
    return await this.repository.findByCorrelationId(correlationId, projectids, args);
  }

  async updateById(
    id: string,
    args: Parameters<BusinessRepository['updateById']>[1],
    transaction?: PrismaTransaction,
  ) {
    return await beginTransactionIfNotExistCurry({
      transaction,
      prismaService: this.prisma,
    })(async tx => {
      const business = await this.repository.updateById(id, args, tx);

      const businessPayload = (await this.repository.findByIdUnscoped(
        business.id,
        {
          select: {
            id: true,
            correlationId: true,
            companyName: true,
            metadata: true,
            createdAt: true,
            updatedAt: true,
            project: {
              select: {
                customer: {
                  select: {
                    id: true,
                    config: true,
                  },
                },
              },
            },
          },
        },
        tx,
      )) as unknown as BusinessPayload;

      if (env.SYNC_UNIFIED_API) {
        await retry(() => this.unifiedApiClient.createOrUpdateBusiness(businessPayload));
      }

      return business;
    });
  }

  async fetchCompanyInformation({
    registrationNumber,
    jurisdictionCode,
    vendor = 'open-corporates',
  }: FetchCompanyInformationParams): Promise<CompanyInformationModel> {
    this.logger.log(`Starting company information fetch`, {
      registrationNumber,
      jurisdictionCode,
      vendor,
    });

    try {
      const request$ = this.httpService.get<TCompanyInformation>(
        `${env.UNIFIED_API_URL}/companies/${jurisdictionCode}/${registrationNumber}`,
        {
          params: { vendor },
          headers: {
            Authorization: `Bearer ${process.env.UNIFIED_API_TOKEN as string}`,
          },
        },
      );
      const result = (await lastValueFrom(request$)).data;

      this.logger.log('Finished company information fetch');

      return plainToClass(CompanyInformationModel, {
        name: result.name,
        companyNumber: result.companyNumber,
        companyType: result.companyType,
        jurisdictionCode: result.jurisdictionCode,
        incorporationDate: result.incorporationDate,
        currentStatus: result.currentStatus,
        vat: '',
      });
    } catch (e) {
      // TODO: have global axios error handler - BAL-916, BAL-917
      if (e instanceof AxiosError) {
        const axiosError = e as AxiosError;
        this.logger.error(`Failed to fetch company information.Error ${axiosError.message}`);

        if (axiosError.status === 500) {
          throw new common.InternalServerErrorException({
            statusCode: 500,
            ...axiosError,
          });
        }

        throw axiosError;
      }

      throw e;
    }
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
