import { apiClient } from '../../common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { Method } from '../../common/enums';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';

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
    schema: z.array(
      ObjectWithIdSchema.extend({
        entity: z.enum(['individuals', 'businesses']),
        name: z.string(),
      }),
    ),
  });

  return handleZodError(error, filters);
};
