import { z } from 'zod';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { FindingsSchema } from '@/pages/MerchantMonitoring/schemas';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

export const fetchFindings = async () => {
  const [data, error] = await apiClient({
    endpoint: `../external/business-reports/findings`,
    method: Method.GET,
    schema: z.object({ data: FindingsSchema }),
    timeout: 300_000,
  });

  return handleZodError(error, data?.data);
};
