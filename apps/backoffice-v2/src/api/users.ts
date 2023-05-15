import { endpoints } from './endpoints';
import { apiClient } from './api-client';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { UsersListSchema } from '../lib/zod/schemas/users';

export const users = {
  list: async () => {
    const [users, error] = await apiClient({
      endpoint: endpoints.users.list.endpoint(),
      method: endpoints.users.list.method,
      schema: UsersListSchema,
    });

    return handleZodError(error, users);
  },
};
