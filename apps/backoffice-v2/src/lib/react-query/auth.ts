import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const auth = createQueryKeys('auth', {
  getSession: () => ({
    queryKey: ['session'],
    queryFn: () => api.auth.getSession(),
  }),
});
