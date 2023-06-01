import { apiClient } from '../../common/api-client/api-client';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { Method } from '../../common/enums';
import { BusinessByIdSchema, BusinessesListSchema } from './validation-schemas';

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
    endpoint: `businesses/${businessId}?filterId=${filterId ?? ''}`,
    method: Method.GET,
    schema: BusinessByIdSchema,
  });

  return handleZodError(error, business);
};
