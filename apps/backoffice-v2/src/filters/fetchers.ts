import { apiClient } from '../api/api-client';
import { z } from 'zod';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { Method } from '../enums';

export const fetchFilterById = async (filterId: string) => {
  const [filter, error] = await apiClient({
    endpoint: `filters/${filterId}`,
    method: Method.GET,
    schema: z.any(),
  });

  return handleZodError(error, filter);
};

export const fetchFilters = async () => {
  const [filters, error] = await apiClient({
    endpoint: `filters`,
    method: Method.GET,
    schema: z.any(),
  });

  return handleZodError(error, filters);
};
