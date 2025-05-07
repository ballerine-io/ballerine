import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  MerchantReportType,
  MerchantReportVersion,
  ReportSchema,
  UpdateableReportStatus,
} from '@ballerine/common';

import { env } from '@/env';
import * as errors from '@/errors';
import { CountryCode } from '@/common/countries';

const CreateReportResponseSchema = z.object({});

const FindManyReportsResponseSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  data: z.array(ReportSchema),
});

const MetricsResponseSchema = z.object({
  riskLevelCounts: z.object({
    low: z.number(),
    medium: z.number(),
    high: z.number(),
    critical: z.number(),
  }),
  violationCounts: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      count: z.number(),
    }),
  ),
  totalActiveMerchants: z.number(),
  addedMerchantsCount: z.number(),
  removedMerchantsCount: z.number(),
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
      timeout: 300_000,
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
    requestedByUserId,
    projectId,
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
    requestedByUserId?: string;
    projectId: string;
  }) {
    const response = await this.axios.post(`merchants/analysis`, {
      websiteUrl,
      countryCode,
      parentCompanyName,
      reportType,
      workflowVersion,
      ...(compareToReportId && { compareToReportId }),
      withQualityControl,
      merchantId: businessId,
      // TODO: Check if we can deprecate it, as we get the report information from the unified api - we dont need to ge this callback with the data.
      callbackUrl: `${env.APP_API_URL}/api/v1/internal/business-reports/hook?businessId=${businessId}`,
      metadata: {
        ...(workflowRuntimeDataId && { workflowRuntimeDataId }),
        requestedByUserId,
        projectId,
      },
      customerId,
    });

    return CreateReportResponseSchema.parse(response.data);
  }

  public async createBatch({
    customerId,
    workflowVersion,
    withQualityControl,
    reportType,
    reports,
  }: {
    customerId: string;
    workflowVersion?: MerchantReportVersion;
    withQualityControl?: boolean;
    reportType: MerchantReportType;
    reports: Array<{
      businessId: string;
      websiteUrl: string;
      countryCode?: string;
      parentCompanyName?: string;
      callbackUrl?: string;
    }>;
  }) {
    await this.axios.post(
      'merchants/analysis/batch/next',
      reports.map(report => ({
        customerId,
        merchantId: report.businessId,
        websiteUrl: report.websiteUrl,
        countryCode: report.countryCode,
        parentCompanyName: report.parentCompanyName,
        callbackUrl: report.callbackUrl,
        reportType,
        workflowVersion,
        withQualityControl,
      })),
    );
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
    from,
    to,
    page,
    reportType,
    riskLevels,
    statuses,
    findings,
    isAlert,
    withoutUnpublishedOngoingReports,
    withoutExampleReports,
    searchQuery,
  }: {
    customerId: string;
    businessId?: string;
    limit?: number;
    page?: number;
    from?: string;
    to?: string;
    reportType?: MerchantReportType;
    riskLevels?: Array<'low' | 'medium' | 'high' | 'critical'>;
    statuses?: Array<'failed' | 'quality-control' | 'completed' | 'in-progress'>;
    findings?: string[];
    isAlert?: boolean;
    withoutUnpublishedOngoingReports?: boolean;
    withoutExampleReports?: boolean;
    searchQuery?: string;
  }) {
    const response = await axios.get(`${env.UNIFIED_API_URL}/external/tld`, {
      params: {
        customerId,
        ...(businessId && { merchantId: businessId }),
        limit,
        from,
        to,
        riskLevels,
        page,
        statuses,
        findings,
        isAlert,
        withoutUnpublishedOngoingReports,
        withoutExampleReports,
        ...(searchQuery && { searchQuery }),
        ...(reportType && { reportType }),
      },
      headers: {
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
      },
    });

    return FindManyReportsResponseSchema.parse(response.data);
  }

  public async count({ customerId, noExample }: { customerId: string; noExample?: boolean }) {
    const response = await this.findMany({
      customerId,
      limit: 1,
      page: 1,
      withoutExampleReports: noExample,
    });

    return response.totalItems;
  }

  public async listFindings() {
    const response = await this.axios.get('external/findings', {
      headers: {
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
      },
    });

    return response.data ?? [];
  }

  public async updateStatus({
    status,
    reportId,
    customerId,
  }: {
    reportId: string;
    customerId: string;
    status: UpdateableReportStatus;
  }) {
    await this.axios.put(`merchants/analysis/${reportId}/status`, {
      status,
      customerId,
    });
  }

  public async getMetrics({
    customerId,
    from,
    to,
  }: {
    customerId: string;
    from?: string;
    to?: string;
  }) {
    const response = await this.axios.get('merchants/analysis/metrics', {
      params: {
        customerId,
        from,
        to,
      },
      headers: {
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
      },
    });

    return MetricsResponseSchema.parse(response.data);
  }
}
