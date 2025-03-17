import axios, { AxiosInstance } from 'axios';
import { env } from '@/env';
import { Logger } from '@nestjs/common';
import { Business, Customer } from '@prisma/client';
import { TSchema } from '@sinclair/typebox';
import { FEATURE_LIST, TCustomerWithFeatures } from '@/customer/types';
import { TCustomerConfig } from '@/customer/schemas/zod-schemas';

export type BusinessPayload = Pick<
  Business,
  'id' | 'correlationId' | 'companyName' | 'metadata' | 'createdAt' | 'updatedAt'
> & {
  project: { customer: { id: string; config: TCustomerConfig | null } };
};

export type TOcrImages = Array<
  | {
      remote: {
        imageUri: string;
        mimeType: string;
      };
    }
  | {
      base64: string;
    }
>;

export class UnifiedApiClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger(UnifiedApiClient.name);

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.UNIFIED_API_URL,
      headers: {
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN as string}`,
      },
    });
  }

  async runOcr({ images, schema }: { images: TOcrImages; schema: TSchema }) {
    return await this.axiosInstance.post('/v1/smart-ocr', {
      images,
      schema,
    });
  }

  async runDocumentOcr({
    images,
    supportedCountries,
    overrideSchemas,
  }: {
    images: TOcrImages;
    supportedCountries: string[];
    overrideSchemas: {
      overrideSchemas: Array<{
        countryCode: string;
        documentType: string;
        documentCategory: string;
        schema: TSchema;
      }>;
    };
  }) {
    return await this.axiosInstance.post('/v1/document/smart-ocr', {
      images,
      supportedCountries,
      overrideSchemas,
    });
  }

  public async createCustomer(payload: Customer) {
    return await this.axiosInstance.post('/customers', payload);
  }

  public async updateCustomer(id: string, payload: Customer) {
    return await this.axiosInstance.put(`/customers/${id}`, payload);
  }

  public async deleteCustomer(id: string) {
    return await this.axiosInstance.delete(`/customers/${id}`);
  }

  public async createOrUpdateBusiness(payload: BusinessPayload) {
    if (!this.shouldUpdateBusiness(payload)) {
      return;
    }

    const formattedPayload = this.formatBusiness(payload);

    return await this.axiosInstance.put(
      `/customers/${payload.project.customer.id}/businesses/${payload.id}`,
      formattedPayload,
    );
  }

  public formatBusiness(business: BusinessPayload) {
    const metadata = business.metadata as unknown as {
      featureConfig: TCustomerWithFeatures['features'];
      lastOngoingReportInvokedAt: number;
    } | null;

    const unsubscribedMonitoringAt = metadata?.featureConfig?.[FEATURE_LIST.ONGOING_MERCHANT_REPORT]
      ?.disabledAt
      ? new Date(metadata.featureConfig[FEATURE_LIST.ONGOING_MERCHANT_REPORT]!.disabledAt!)
      : metadata?.featureConfig?.[FEATURE_LIST.ONGOING_MERCHANT_REPORT]?.enabled === false
      ? new Date()
      : null;

    return {
      id: business.id,
      correlationId: business.correlationId,
      companyName: business.companyName,
      customerId: business.project.customer.id,
      unsubscribedMonitoringAt: unsubscribedMonitoringAt?.toISOString() ?? null,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    };
  }

  public shouldUpdateBusiness(business: BusinessPayload) {
    return business.project.customer.config?.disableBusinessSyncToUnifiedApi !== true;
  }

  public async runEntityMatchingV2(payload: {
    entity1: string;
    entity2: string;
    includeAnalysis: boolean;
  }) {
    return await this.axiosInstance.post('/entity-matching-v2', {
      entity1: { value: payload.entity1 },
      entity2: { value: payload.entity2 },
      includeAnalysis: payload.includeAnalysis,
    });
  }
}
