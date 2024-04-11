import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

export const BusinessReportSchema = z.object({
  reportFileId: z.string(),
});
export const BusinessReportsSchema = z.array(BusinessReportSchema);

export const fetchBusinessReports = async ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: 'ONGOING_MERCHANT_REPORT_T1';
}) => {
  const [filter, error] = await apiClient({
    endpoint: `business-reports?businessId=${businessId}&reportType=${reportType}`,
    method: Method.GET,
    schema: BusinessReportSchema,
  });

  return handleZodError(error, filter);
};
