import { endpoints } from './endpoints';
import { apiClient } from './api-client';
import { BusinessByIdSchema, BusinessesListSchema } from '../lib/zod/schemas/businesses';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';

export const businesses = {
  list: async (filterId: string) => {
    const [businesses, error] = await apiClient({
      endpoint: endpoints.businesses.list.endpoint(filterId),
      method: endpoints.businesses.list.method,
      schema: BusinessesListSchema,
    });

    return handleZodError(error, businesses);
  },
  byId: async ({ businessId, filterId }: { businessId: string; filterId: string }) => {
    const [business, error] = await apiClient({
      endpoint: endpoints.businesses.byId.endpoint({
        businessId,
        filterId,
      }),
      method: endpoints.businesses.byId.method,
      schema: BusinessByIdSchema,
    });

    return handleZodError(error, business);
  },
};
