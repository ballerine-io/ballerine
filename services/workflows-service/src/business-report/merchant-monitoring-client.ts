import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from '@/env';
import { CountryCode } from '@/common/countries';
import {
  MERCHANT_REPORT_STATUSES,
  MERCHANT_REPORT_TYPES,
  MERCHANT_REPORT_TYPES_MAP,
  MERCHANT_REPORT_VERSIONS,
  MerchantReportType,
  MerchantReportVersion,
} from '@/business-report/constants';
import { TReportRequest } from '@/common/utils/unified-api-client/unified-api-client';
import * as errors from '@/errors';

const CreateReportResponseSchema = z.object({});
const CreateReportBatchResponseSchema = z.array(
  z.object({
    reportId: z.string(),
  }),
);
const ReportSchema = z.object({
  id: z.string(),
  websiteId: z.string(),
  merchantId: z.string(),
  reportType: z.enum([MERCHANT_REPORT_TYPES[0]!, ...MERCHANT_REPORT_TYPES.slice(1)]),
  workflowVersion: z.enum([MERCHANT_REPORT_VERSIONS[0]!, ...MERCHANT_REPORT_VERSIONS.slice(1)]),
  parentCompanyName: z.string().nullable(),
  status: z.enum([MERCHANT_REPORT_STATUSES[0]!, ...MERCHANT_REPORT_STATUSES.slice(1)]),
  metadata: z
    .object({
      workflowRuntimeDataId: z.string().optional(),
    })
    .nullable(),
  riskScore: z.number().nullable(),
  isAlert: z.boolean().nullable(),
  companyName: z.string().nullish(),
  website: z.object({
    id: z.string(),
    url: z.string().url(),
    createdAt: z
      .string()
      .datetime()
      .transform(value => new Date(value)),
    updatedAt: z
      .string()
      .datetime()
      .transform(value => new Date(value)),
  }),
  createdAt: z
    .string()
    .datetime()
    .transform(value => new Date(value)),
  updatedAt: z
    .string()
    .datetime()
    .transform(value => new Date(value)),
  data: z.record(z.string(), z.unknown()).nullish(),
});
const FindManyReportsResponseSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  data: z.array(ReportSchema),
});

@Injectable()
export class MerchantMonitoringClient {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: env.UNIFIED_API_URL,
      headers: {
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN ?? ''}`,
      },
      timeout: 30_000,
    });
  }

  public async create({
    websiteUrl,
    countryCode,
    parentCompanyName,
    businessId,
    reportType,
    workflowVersion,
    customerId,
    compareToReportId,
    withQualityControl,
    workflowRuntimeDataId,
  }: {
    websiteUrl: string;
    countryCode?: CountryCode;
    parentCompanyName?: string;
    businessId: string;
    reportType: MerchantReportType;
    workflowVersion: string;
    customerId: string;
    compareToReportId?: string;
    withQualityControl?: boolean;
    workflowRuntimeDataId?: string;
  }) {
    const response = await this.axios.post(`merchants/analysis`, {
      websiteUrl,
      countryCode,
      parentCompanyName,
      reportType,
      workflowVersion,
      ...(compareToReportId && { compareToReportId }),
      ...(withQualityControl && { withQualityControl }),
      merchantId: businessId,
      callbackUrl: `${env.APP_API_URL}/api/v1/internal/business-reports/hook?businessId=${businessId}`,
      metadata: {
        ...(workflowRuntimeDataId && { workflowRuntimeDataId }),
      },
      customerId,
    });

    return CreateReportResponseSchema.parse(response.data);
  }

  public async createBatch({
    reportRequests,
    clientName,
    metadata,
    withQualityControl,
    reportType = MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1,
    workflowVersion = '2',
  }: {
    reportRequests: TReportRequest;
    clientName?: string;
    reportType?: MerchantReportType;
    workflowVersion?: MerchantReportVersion;
    metadata?: Record<string, unknown>;
    withQualityControl?: boolean;
  }) {
    const response = await this.axios.post('merchants/analysis/batch', {
      reportRequests,
      clientName,
      metadata,
      reportType,
      withQualityControl,
      workflowVersion,
    });

    return CreateReportBatchResponseSchema.parse(response.data);
  }

  public async findById({ id, customerId }: { id: string; customerId: string }) {
    try {
      const response = await axios.get(`${env.UNIFIED_API_URL}/merchants/analysis/${id}`, {
        params: {
          customerId,
        },
        headers: {
          Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
        },
      });

      return ReportSchema.parse(response.data);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new errors.NotFoundException(`No business report found for id ${id}`);
      }

      throw error;
    }
  }

  public async findLatest({
    customerId,
    businessId,
    reportType,
  }: {
    customerId: string;
    businessId: string;
    reportType?: MerchantReportType;
  }) {
    const response = await this.findMany({
      customerId,
      businessId,
      ...(reportType && { reportType }),
      limit: 1,
      page: 1,
    });

    return response.data[0] ?? null;
  }

  public async findMany({
    customerId,
    businessId,
    limit,
    page,
    reportType,
    withoutUnpublishedOngoingReports,
    searchQuery,
  }: {
    customerId: string;
    businessId?: string;
    limit: number;
    page: number;
    reportType?: MerchantReportType;
    withoutUnpublishedOngoingReports?: boolean;
    searchQuery?: string;
  }) {
    const response = await axios.get(`${env.UNIFIED_API_URL}/external/tld`, {
      params: {
        customerId,
        ...(businessId && { merchantId: businessId }),
        limit,
        page,
        withoutUnpublishedOngoingReports,
        ...(searchQuery && { searchQuery }),
        ...(reportType && { reportType }),
      },
      headers: {
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
      },
    });

    return FindManyReportsResponseSchema.parse(response.data);
  }

  public async count({ customerId }: { customerId: string }) {
    const response = await this.findMany({ customerId, limit: 1, page: 1 });

    return response.totalItems;
  }
}
