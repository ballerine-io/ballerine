import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

import { BusinessReportsSchema } from '@/domains/business-reports/fetchers';

export const fetchBusinessReports = async ({ businessId }: { businessId: string }) => {
  const [filter, error] = await apiClient({
    endpoint: `business-reports?businessId=${businessId}`,
    method: Method.GET,
    schema: BusinessReportsSchema,
  });

  return handleZodError(error, filter);
};
