import { z } from 'zod';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

export type TurnOngoingMonitoringBody = z.infer<typeof TurnOngoingMonitoringBodySchema>;
export const TurnOngoingMonitoringBodySchema = z.object({
  state: z.string(),
});

export type TurnOngoingMonitoringResponse = z.infer<typeof TurnOngoingMonitoringResponseSchema>;
export const TurnOngoingMonitoringResponseSchema = z.object({
  state: z.string(),
});

export const turnOngoingMonitoring = async ({
  merchantId,
  body,
}: {
  merchantId: string;
  body: TurnOngoingMonitoringBody;
}) => {
  const [data, error] = await apiClient({
    endpoint: `../external/businesses/${merchantId}/monitoring`,
    method: Method.PATCH,
    body,
    schema: TurnOngoingMonitoringResponseSchema,
    timeout: 300_000,
  });

  return handleZodError(error, data);
};
