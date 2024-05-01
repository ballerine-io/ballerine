import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

export const BusinessReportSchema = z
  .object({
    report: z.object({
      reportFileId: z.string(),
    }),
  })
  .optional();

export const fetchBusinessReports = async ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: 'MERCHANT_REPORT_T1' & (string & {});
}) => {
  const [filter, error] = await apiClient({
    endpoint: `business-reports/latest?businessId=${businessId}&type=${reportType}`,
    method: Method.GET,
    schema: BusinessReportSchema,
  });

  return handleZodError(error, filter);
};
