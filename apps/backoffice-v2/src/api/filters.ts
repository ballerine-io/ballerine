import { apiClient } from './api-client';
import { endpoints } from './endpoints';
import { z } from 'zod';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';

export const filters = {
  getById: async (filterId: string) => {
    const [filters, error] = await apiClient({
      endpoint: endpoints.filters.byId.endpoint({ filterId }),
      method: endpoints.filters.list.method,
      schema: z.any(),
    });

    return handleZodError(error, filters);
  },
  list: async () => {
    const [filter, error] = await apiClient({
      endpoint: endpoints.filters.list.endpoint(),
      method: endpoints.filters.list.method,
      schema: z.any(),
    });

    return handleZodError(error, filter);
  },
};
