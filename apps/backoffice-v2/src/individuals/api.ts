import { apiClient } from '../api/api-client';
import { EndUserByIdSchema, EndUsersListSchema } from '../lib/zod/schemas/end-users';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { Method } from '../enums';

export const fetchIndividuals = async (filterId: string) => {
  const [individuals, error] = await apiClient({
    endpoint: `end-users?filterId=${filterId ?? ''}`,
    method: Method.GET,
    schema: EndUsersListSchema,
  });

  return handleZodError(error, individuals);
};

export const fetchIndividualById = async (individualId: string, filterId: string) => {
  const [individual, error] = await apiClient({
    endpoint: `end-users/${individualId}?filterId=${filterId ?? ''}`,
    method: Method.GET,
    schema: EndUserByIdSchema,
  });

  return handleZodError(error, individual);
};

export const updateIndividualById = async (
  individualId: string,
  body: Record<PropertyKey, unknown>,
) => {
  const [individual, error] = await apiClient({
    endpoint: `end-users/${individualId}`,
    method: Method.PATCH,
    body,
    schema: EndUserByIdSchema,
  });

  return handleZodError(error, individual);
};
