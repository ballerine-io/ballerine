import { z } from 'zod';
import { apiClient } from '../../common/api-client/api-client';
import { Method } from '../../common/enums';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';

export const FilterSchema = ObjectWithIdSchema.extend({
  entity: z.enum(['individuals', 'businesses']),
  name: z.string(),
  query: z
    .object({
      where: z.object({
        workflowDefinitionId: z.union([z.object({ in: z.array(z.string()) }), z.string()]),
      }),
    })
    .optional(),
});

export type TFilter = z.output<typeof FilterSchema>;

export const fetchFilterById = async (filterId: string) => {
  const [filter, error] = await apiClient({
    endpoint: `filters/${filterId}`,
    method: Method.GET,
    schema: FilterSchema,
  });

  return handleZodError(error, filter);
};

export const fetchFilters = async () => {
  const [filters, error] = await apiClient({
    endpoint: `filters`,
    method: Method.GET,
    schema: z.array(FilterSchema),
  });

  return handleZodError(error, filters);
};
