import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '@/api/api';

export const endUsers = createQueryKeys('end-users', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => api.endUsers.list(),
  }),
  byId: (endUserId: string) => ({
    queryKey: [endUserId],
    queryFn: () => api.endUsers.byId(endUserId),
  }),
});
