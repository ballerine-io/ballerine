import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { TBusinessReportType } from '@/domains/business-reports/types';

export const BusinessReportSchema = z
  .object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    report: z.object({
      reportFileId: z.string(),
    }),
    business: z
      .object({
        companyName: z.string(),
        country: z.string().nullable(),
        website: z.string().nullable(),
      })
      .nullable(),
  })
  .optional();

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

export const fetchBusinessReports = async ({ reportType }: { reportType: TBusinessReportType }) => {
  const [filter, error] = await apiClient({
    endpoint: `business-reports/?type=${reportType}`,
    method: Method.GET,
    schema: BusinessReportsSchema,
  });

  return handleZodError(error, filter);
};
