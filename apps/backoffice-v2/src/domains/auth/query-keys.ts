import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchAuthenticatedUser } from './fetchers';

export const authQueryKeys = createQueryKeys('auth', {
  authenticatedUser: () => ({
    queryKey: ['session'],
    queryFn: () => fetchAuthenticatedUser(),
  }),
});
