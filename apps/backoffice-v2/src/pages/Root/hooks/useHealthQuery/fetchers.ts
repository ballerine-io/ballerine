import { apiClient } from '../../../../common/api-client/api-client';
import { Method } from '../../../../common/enums';
import { z } from 'zod';
import { handleZodError } from '../../../../common/utils/handle-zod-error/handle-zod-error';
import { env } from '../../../../common/env/env';

export const fetchHealth = async () => {
  const [session, error] = await apiClient({
    url: `${env.VITE_API_URL.replace('internal', '')}_health/live`,
    method: Method.GET,
    schema: z.void(),
  });

  return handleZodError(error, session);
};
