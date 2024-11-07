import axios, { AxiosInstance } from 'axios';
import { env } from '@/env';
import { Logger } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { TSchema } from '@sinclair/typebox';

export type TReportRequest = Array<{
  websiteUrl: string;
  callbackUrl?: string;
  countryCode?: string;
  parentCompanyName?: string;
  lineOfBusiness?: string;
  merchantName?: string;
  businessReportId?: string;
  withQualityControl?: boolean;
  customerId: string;
  merchantId: string;
}>;
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
}
