import { apiClient } from '../api/api-client';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { Method } from '../enums';
import { BusinessByIdSchema, BusinessesListSchema } from './validation-schemas';
import { endpoints } from '../api/endpoints';

export const fetchBusinesses = async (filterId: string) => {
  const [businesses, error] = await apiClient({
    endpoint: `businesses?filterId=${filterId ?? ''}`,
    method: Method.GET,
    schema: BusinessesListSchema,
  });

  return handleZodError(error, businesses);
};

export const fetchBusinessById = async ({
  businessId,
  filterId,
}: {
  businessId: string;
  filterId: string;
}) => {
  const [business, error] = await apiClient({
    endpoint: endpoints.businesses.byId.endpoint({
      businessId,
      filterId,
    }),
    method: endpoints.businesses.byId.method,
    schema: BusinessByIdSchema,
  });

  return handleZodError(error, business);
};
