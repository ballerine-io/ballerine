import { apiClient } from '@/common/api-client/api-client';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { env } from '@/common/env/env';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';

export const AlertDefinitionByAlertIdSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const fetchAlertDefinitionByAlertId = async ({ alertId }: { alertId: string }) => {
  const [alertDefinition, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/${alertId}/alert-definition`,
    method: Method.GET,
    schema: AlertDefinitionByAlertIdSchema,
  });

  return handleZodError(error, alertDefinition);
};
