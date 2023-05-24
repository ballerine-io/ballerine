import { apiClient } from '../../common/api-client/api-client';
import { IndividualByIdSchema, IndividualsListSchema } from './validation-schemas';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { Method } from '../../common/enums';

export const fetchIndividuals = async (filterId: string) => {
  const [individuals, error] = await apiClient({
    endpoint: `end-users?filterId=${filterId ?? ''}`,
    method: Method.GET,
    schema: IndividualsListSchema,
  });

  return handleZodError(error, individuals);
};

export const fetchIndividualById = async (individualId: string, filterId: string) => {
  const [individual, error] = await apiClient({
    endpoint: `end-users/${individualId}?filterId=${filterId ?? ''}`,
    method: Method.GET,
    schema: IndividualByIdSchema,
  });

  return handleZodError(error, individual);
};

export const fetchUpdateIndividualById = async (
  individualId: string,
  body: Record<PropertyKey, unknown>,
) => {
  const [individual, error] = await apiClient({
    endpoint: `end-users/${individualId}`,
    method: Method.PATCH,
    body,
    schema: IndividualByIdSchema,
  });

  return handleZodError(error, individual);
};
