import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import qs from 'qs';
import { toast } from 'sonner';
import { t } from 'i18next';
import {
  MERCHANT_REPORT_STATUSES,
  MERCHANT_REPORT_TYPES,
  MERCHANT_REPORT_VERSIONS,
  MerchantReportType,
  MerchantReportVersion,
} from '@/domains/business-reports/constants';
import { UnknownRecord } from 'type-fest';

export const BusinessReportSchema = z
  .object({
    id: z.string(),
    reportType: z.enum([MERCHANT_REPORT_TYPES[0]!, ...MERCHANT_REPORT_TYPES.slice(1)]),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    riskScore: z.number().nullable(),
    status: z.enum([MERCHANT_REPORT_STATUSES[0]!, ...MERCHANT_REPORT_STATUSES.slice(1)]),
    parentCompanyName: z.string().nullable(),
    merchantId: z.string(),
    workflowVersion: z.enum([MERCHANT_REPORT_VERSIONS[0]!, ...MERCHANT_REPORT_VERSIONS.slice(1)]),
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
    data: z.record(z.string(), z.unknown()).nullish(),
  })
  .transform(data => ({
    ...data,
    companyName:
      data?.companyName ??
      (data?.data?.websiteCompanyAnalysis as UnknownRecord | undefined)?.companyName ??
      data?.parentCompanyName,
    website: data?.website.url,
    data: data.status === 'completed' ? data?.data : null,
    riskScore: data.status === 'completed' ? data?.riskScore : null,
  }));

export const BusinessReportsSchema = z.object({
  data: z.array(BusinessReportSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
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
  });

  return handleZodError(error, data);
};

export const fetchBusinessReports = async ({
  reportType,
  ...params
}: {
  reportType: MerchantReportType;
  page: {
    number: number;
    size: number;
  };
  orderBy: string;
}) => {
  const queryParams = qs.stringify(
    {
      ...params,
      type: reportType,
    },
    { encode: false },
  );

  const [data, error] = await apiClient({
    endpoint: `../external/business-reports/?${queryParams}`,
    method: Method.GET,
    schema: BusinessReportsSchema,
  });

  return handleZodError(error, data);
};

export const fetchBusinessReportById = async ({ id }: { id: string }) => {
  const [businessReport, error] = await apiClient({
    endpoint: `../external/business-reports/${id}`,
    method: Method.GET,
    schema: BusinessReportSchema,
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
  });

  return handleZodError(error, batchId);
};
