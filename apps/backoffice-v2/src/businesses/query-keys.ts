import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchBusinessById, fetchBusinesses } from './fetchers';

export const businessesQueryKeys = createQueryKeys('businesses', {
  list: (filterId: string) => ({
    queryKey: [{ filterId }],
    queryFn: () => fetchBusinesses(filterId),
  }),
  byId: (businessId: string, filterId: string) => ({
    queryKey: [{ businessId, filterId }],
    queryFn: () =>
      fetchBusinessById({
        businessId,
        filterId,
      }),
  }),
});
