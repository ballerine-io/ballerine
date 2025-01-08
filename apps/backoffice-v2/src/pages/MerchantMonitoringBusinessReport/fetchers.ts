import { z } from 'zod';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

export const turnOngoingMonitoring = async ({
  merchantId,
  state,
}: {
  merchantId: string;
  state: 'on' | 'off';
}) => {
  const [data, error] = await apiClient({
    endpoint: `../external/businesses/${merchantId}/monitoring/${state}`,
    method: Method.PATCH,
    schema: z.undefined(),
    timeout: 300_000,
  });

  return handleZodError(error, data);
};
