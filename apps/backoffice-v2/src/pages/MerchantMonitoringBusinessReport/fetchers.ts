import { z } from 'zod';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

export const UpdateOngoingMonitoringStatusBodySchema = z.object({
  status: z.enum(['active', 'inactive']),
});

export type UpdateOngoingMonitoringStatusBody = z.infer<
  typeof UpdateOngoingMonitoringStatusBodySchema
>;

export const updateOngoingMonitoringStatus = async ({
  websiteId,
  body,
}: {
  websiteId: string;
  body: UpdateOngoingMonitoringStatusBody;
}) => {
  const [data, error] = await apiClient({
    endpoint: `../external/business-reports/websites/${websiteId}/monitoring`,
    method: Method.PATCH,
    body,
    schema: z.undefined(),
    timeout: 300_000,
  });

  return handleZodError(error, data);
};
