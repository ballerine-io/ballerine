import { endpoints } from './endpoints';
import { apiClient } from './api-client';
import {
  EndUserByIdSchema,
  EndUsersListSchema,
} from '../lib/zod/schemas/end-users';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { env } from '../env/env';
import { endUsers as endUsersApi } from '../lib/mock-service-worker/end-users/end-users.data';

export const endUsers = {
  list: async () => {
    const [data, error] = await apiClient({
      endpoint: endpoints.endUsers.list.endpoint(),
      method: endpoints.endUsers.list.method,
      schema: EndUsersListSchema,
    });
    const { endUsers } = data ?? {};

    return handleZodError(error, endUsers);
  },
  byId: async (endUserId: string) => {
    // TODO: Remove once Mock Service Worker is no longer in use.
    // When the page reloads the end user with the ID matching the ID in the
    // URL no longer exists on the first render, causing a 404 error
    // which blocks the page from rendering before redirecting to the
    // sign in page.
    if (env.VITE_MOCK_SERVER && !endUsersApi.findById(endUserId)) return {};

    const [data, error] = await apiClient({
      endpoint: endpoints.endUsers.byId.endpoint(endUserId),
      method: endpoints.endUsers.byId.method,
      schema: EndUserByIdSchema,
    });
    const { endUser } = data ?? {};

    return handleZodError(error, endUser);
  },
  updateById: async (endUserId, body) => {
    const [data, error] = await apiClient({
      endpoint: endpoints.endUsers.updateById.endpoint(endUserId),
      method: endpoints.endUsers.updateById.method,
      body,
      schema: EndUserByIdSchema,
    });
    const { endUser } = data ?? {};

    return handleZodError(error, endUser);
  },
};
