import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { TBusinessReportType } from '@/domains/business-reports/types';
import qs from 'qs';
import { Severities, TObjectValues } from '@/common/types';
import { toast } from 'sonner';
import { t } from 'i18next';

export const BusinessReportStatus = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type TBusinessReportStatus = TObjectValues<typeof BusinessReportStatus>;

export type TBusinessReportStatuses = TBusinessReportStatus[];

export const BusinessReportStatuses = [
  BusinessReportStatus.NEW,
  BusinessReportStatus.IN_PROGRESS,
  BusinessReportStatus.COMPLETED,
] as const satisfies readonly TBusinessReportStatus[];

export const severityToDisplaySeverity = {
  positive: 'low',
  moderate: 'medium',
} as const;

export const SeveritySchema = z.preprocess(value => {
  if (value === 'moderate') {
    return 'medium';
  }

  if (value === 'positive') {
    return 'low';
  }

  return value;
}, z.enum(Severities));

export const BusinessReportSchema = z
  .object({
    id: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    riskScore: z.number().nullable(),
    status: z.enum(BusinessReportStatuses),
    report: z.object({
      reportFileId: z.union([z.string(), z.undefined()]),
      data: z.union([z.record(z.string(), z.unknown()), z.undefined()]),
    }),
    business: z
      .object({
        companyName: z.string(),
        country: z.string().nullable(),
        website: z.string().nullable(),
      })
      .nullable(),
  })
  .optional()
  .transform(value => ({
    ...value,
    companyName:
      value?.report.data?.websiteCompanyAnalysis?.companyName || value?.business?.companyName,
    website: value?.report.data?.websiteCompanyAnalysis?.website.url || value?.business?.website,
  }));

export const BusinessReportsSchema = z.array(BusinessReportSchema);

export type TBusinessReport = z.infer<typeof BusinessReportSchema>;

export type TBusinessReports = z.infer<typeof BusinessReportsSchema>;

export const fetchLatestBusinessReport = async ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: TBusinessReportType;
}) => {
  const [filter, error] = await apiClient({
    endpoint: `business-reports/latest?businessId=${businessId}&type=${reportType}`,
    method: Method.GET,
    schema: BusinessReportSchema,
  });

  return handleZodError(error, filter);
};

export const fetchBusinessReports = async ({
  reportType,
  ...params
}: {
  reportType: TBusinessReportType;
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

  const [filter, error] = await apiClient({
    endpoint: `business-reports/?${queryParams}`,
    method: Method.GET,
    schema: BusinessReportsSchema,
  });

  return handleZodError(error, filter);
};

export const fetchBusinessReportById = async ({ id }: { id: string }) => {
  const [filter, error] = await apiClient({
    endpoint: `business-reports/${id}`,
    method: Method.GET,
    schema: BusinessReportSchema,
  });

  return handleZodError(error, filter);
};

export const createBusinessReport = async ({
  websiteUrl,
  operatingCountry,
  companyName,
  businessCorrelationId,
  reportType,
  isExample,
}:
  | {
      websiteUrl: string;
      operatingCountry?: string;
      reportType: TBusinessReportType;
      companyName: string;
      isExample: boolean;
    }
  | {
      websiteUrl: string;
      operatingCountry?: string;
      reportType: TBusinessReportType;
      businessCorrelationId: string;
      isExample: boolean;
    }) => {
  if (isExample) {
    toast.info(t('toast:business_report_creation.is_example'));

    return;
  }

  const [businessReport, error] = await apiClient({
    endpoint: `business-reports`,
    method: Method.POST,
    schema: z.undefined(),
    body: {
      websiteUrl,
      countryCode: operatingCountry,
      merchantName: companyName,
      businessCorrelationId,
      reportType,
    },
  });

  return handleZodError(error, businessReport);
};
