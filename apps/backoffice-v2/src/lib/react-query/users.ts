import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const users = createQueryKeys('users', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => api.users.list(),
  }),
});
