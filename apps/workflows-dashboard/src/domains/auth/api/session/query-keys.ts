import { fetchSession } from '@/domains/auth/api/session/session.api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const sessionKeys = createQueryKeys('session', {
  details: () => ({
    queryKey: ['session'],
    queryFn: fetchSession,
  }),
});
