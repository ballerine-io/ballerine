import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchUsers } from './fetchers';

export const usersQueryKeys = createQueryKeys('users', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => fetchUsers(),
  }),
});
