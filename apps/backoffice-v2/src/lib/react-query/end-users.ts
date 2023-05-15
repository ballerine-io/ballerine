import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const endUsers = createQueryKeys('end-users', {
  list: (filterId: string) => ({
    queryKey: [{ filterId }],
    queryFn: () => api.endUsers.list(filterId),
  }),
  byId: (endUserId: string, filterId: string) => ({
    queryKey: [{ endUserId, filterId }],
    queryFn: () => api.endUsers.byId({ endUserId, filterId }),
  }),
});
