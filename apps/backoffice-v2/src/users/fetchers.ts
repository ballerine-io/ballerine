import { apiClient } from '../api/api-client';
import { UsersListSchema } from '../lib/zod/schemas/users';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { Method } from '../enums';

export const fetchUsers = async () => {
  const [users, error] = await apiClient({
    endpoint: `users`,
    method: Method.GET,
    schema: UsersListSchema,
  });

  return handleZodError(error, users);
};
