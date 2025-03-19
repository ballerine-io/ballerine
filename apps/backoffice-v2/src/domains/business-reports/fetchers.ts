import qs from 'qs';
import { z } from 'zod';
import { t } from 'i18next';
import { toast } from 'sonner';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { TReportStatusValue, TRiskLevel } from '@/pages/MerchantMonitoring/schemas';
import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import {
  MERCHANT_REPORT_STATUSES_MAP,
  MerchantReportStatus,
  MerchantReportType,
  MerchantReportVersion,
  ReportSchema,
  UPDATEABLE_REPORT_STATUSES,
} from '@ballerine/common';

const statusOverrides = {
  [MERCHANT_REPORT_STATUSES_MAP.failed]: MERCHANT_REPORT_STATUSES_MAP['in-progress'],
  [MERCHANT_REPORT_STATUSES_MAP['quality-control']]: MERCHANT_REPORT_STATUSES_MAP['in-progress'],
} as const satisfies Partial<Record<MerchantReportStatus, MerchantReportStatus>>;

export const BusinessReportSchema = ReportSchema.transform(data => {
  const isReportReady = UPDATEABLE_REPORT_STATUSES.includes(data.status);

  return {
    ...data,
    status: data.status in statusOverrides ? statusOverrides[data.status] : data.status,
    website: data.website.url,
    riskLevel: isReportReady ? data.riskLevel : null,
    data: isReportReady ? data?.data : null,
    isExample: data.metadata?.isExample ?? false,
  };
});

export const BusinessReportsSchema = z.object({
  data: z.array(BusinessReportSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});

export const BusinessReportsCountSchema = z.object({
  count: z.number(),
});

export type TBusinessReport = z.infer<typeof BusinessReportSchema>;

export type TBusinessReports = z.infer<typeof BusinessReportsSchema>;

export const fetchLatestBusinessReport = async ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: MerchantReportType;
}) => {
  const [data, error] = await apiClient({
    endpoint: `../external/business-reports/latest?businessId=${businessId}&type=${reportType}`,
    method: Method.GET,
    schema: BusinessReportSchema,
    timeout: 30_000,
  });

  return handleZodError(error, data);
};

export interface BusinessReportsFilterParams {
  reportType?: MerchantReportType;
  riskLevels?: TRiskLevel[];
  statuses?: TReportStatusValue[];
  findings?: string[];
  from?: string;
  to?: string;
  orderBy?: string;
}

export interface BusinessReportsParams extends BusinessReportsFilterParams, PaginationParams {}

export const fetchBusinessReports = async (params: BusinessReportsParams) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [data, error] = await apiClient({
    endpoint: `../external/business-reports/?${queryParams}`,
    method: Method.GET,
    schema: BusinessReportsSchema,
    timeout: 30_000,
  });

  return handleZodError(error, data);
};

export const countBusinessReports = async (params: BusinessReportsParams) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [data, error] = await apiClient({
    endpoint: `../external/business-reports/count/?${queryParams}`,
    method: Method.GET,
    schema: BusinessReportsCountSchema,
    timeout: 30_000,
  });

  return handleZodError(error, data);
};

export const fetchBusinessReportById = async ({ id }: { id: string }) => {
  const [businessReport, error] = await apiClient({
    endpoint: `../external/business-reports/${id}`,
    method: Method.GET,
    schema: BusinessReportSchema,
    timeout: 30_000,
  });

  return handleZodError(error, businessReport);
};

export const createBusinessReport = async ({
  websiteUrl,
  operatingCountry,
  companyName,
  businessCorrelationId,
  reportType,
  workflowVersion,
  isExample,
}:
  | {
      websiteUrl: string;
      operatingCountry?: string;
      reportType: MerchantReportType;
      workflowVersion: MerchantReportVersion;
      companyName: string;
      isExample: boolean;
    }
  | {
      websiteUrl: string;
      operatingCountry?: string;
      reportType: MerchantReportType;
      workflowVersion: MerchantReportVersion;
      businessCorrelationId: string;
      isExample: boolean;
    }) => {
  if (isExample) {
    toast.info(t('toast:business_report_creation.is_example'));

    return;
  }

  const [businessReport, error] = await apiClient({
    endpoint: `../external/business-reports`,
    method: Method.POST,
    schema: z.undefined(),
    body: {
      websiteUrl,
      countryCode: operatingCountry,
      merchantName: companyName,
      businessCorrelationId,
      reportType,
      workflowVersion,
    },
    timeout: 30_000,
  });

  return handleZodError(error, businessReport);
};

export const createBusinessReportBatch = async ({
  merchantSheet,
  isExample,
  reportType,
  workflowVersion,
}: {
  merchantSheet: File;
  isExample: boolean;
  reportType: MerchantReportType;
  workflowVersion: string;
}) => {
  if (isExample) {
    toast.info(t('toast:batch_business_report_creation.is_example'));

    return;
  }

  const formData = new FormData();
  formData.append('file', merchantSheet);
  formData.append('type', reportType);
  formData.append('workflowVersion', workflowVersion);

  const [batchId, error] = await apiClient({
    endpoint: `../external/business-reports/upload-batch`,
    method: Method.POST,
    schema: z.object({ batchId: z.string() }),
    body: formData,
    isFormData: true,
    timeout: 300_000,
  });

  return handleZodError(error, batchId);
};
