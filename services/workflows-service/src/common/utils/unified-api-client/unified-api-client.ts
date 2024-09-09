import axios, { AxiosInstance } from 'axios';
import { env } from '@/env';
import { Logger } from '@nestjs/common';
import { BusinessReportType } from '@prisma/client';

export type TReportRequest = Array<{
  websiteUrl: string;
  callbackUrl?: string;
  countryCode?: string;
  parentCompanyName?: string;
  lineOfBusiness?: string;
  merchantName?: string;
  websiteName?: string;
  businessReportId?: string;
  withQualityControl?: boolean;
}>;

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

  public async postBatchBusinessReport(
    {
      reportRequests,
      clientName,
      metadata,
      withQualityControl,
      reportType = BusinessReportType.MERCHANT_REPORT_T1,
      workflowVersion = '2',
    }: {
      reportRequests: TReportRequest;
      clientName?: string;
      reportType?: BusinessReportType;
      workflowVersion?: '1' | '2' | '3';
      metadata?: Record<string, unknown>;
      withQualityControl?: boolean;
    },
    endpoint = '/merchants/analysis/batch',
  ) {
    try {
      const response = await this.axiosInstance.post<
        Array<{
          reportId: string;
          businessReportId: string;
        }>
      >(
        endpoint,
        {
          reportRequests,
          clientName,
          metadata,
          reportType,
          withQualityControl,
          workflowVersion,
        },
        {
          timeout: 30_000,
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error creating batch report', error);

      throw error;
    }
  }
}
