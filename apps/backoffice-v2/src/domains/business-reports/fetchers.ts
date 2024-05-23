import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';

export const BusinessReportSchema = z
  .object({
    riskScore: z.number(),
    report: z.object({
      reportFileId: z.string(),
      reportId: z.string(),
    }),
    createdAt: z.string(),
  })
  .optional();

export type TBusinessReport = z.infer<typeof BusinessReportSchema>;

export type TBusinessReportType = ('MERCHANT_REPORT_T1' | 'ONGOING_MERCHANT_REPORT_T1') &
  (string & {});

export const fetchLatestBusinessReport = async ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: TBusinessReportType;
}) => {
  const [businessReports, error] = await apiClient({
    endpoint: `business-reports/latest?businessId=${businessId}&type=${reportType}`,
    method: Method.GET,
    schema: BusinessReportSchema,
  });

  return handleZodError(error, businessReports);
};

export const fetchBusinessReports = async ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: TBusinessReportType;
}) => {
  const [businessReports, error] = await apiClient({
    endpoint: `business-reports/?businessId=${businessId}&type=${reportType}`,
    method: Method.GET,
    schema: z.array(BusinessReportSchema),
  });

  return handleZodError(error, businessReports);
};
