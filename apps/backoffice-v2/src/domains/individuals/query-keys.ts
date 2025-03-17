import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getEndUserById } from './fetchers';

export const endUsersQueryKeys = createQueryKeys('end-users', {
  byId: ({ id }: { id: string }) => ({
    queryKey: ['end-users', id],
    queryFn: () => getEndUserById({ id }),
  }),
});
