import { apiClient } from '../../common/api-client/api-client';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { Method } from '../../common/enums';
import { UsersListSchema } from './validation-schemas';

export const fetchUsers = async () => {
  const [users, error] = await apiClient({
    endpoint: `users`,
    method: Method.GET,
    schema: UsersListSchema,
  });

  return handleZodError(error, users);
};
