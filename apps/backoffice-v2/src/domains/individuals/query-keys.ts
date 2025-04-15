import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getEndUserById, getEndUsersByIds } from './fetchers';

export const endUsersQueryKeys = createQueryKeys('end-users', {
  byId: ({ id }: { id: string }) => ({
    queryKey: ['end-users', id],
    queryFn: () => getEndUserById({ id }),
  }),
  byIds: ({ ids }: { ids: string[] }) => ({
    queryKey: ['end-users', ids],
    queryFn: () => getEndUsersByIds({ ids }),
  }),
});
