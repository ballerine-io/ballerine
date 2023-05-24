import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchIndividualById, fetchIndividuals } from './fetchers';

export const individualsQueryKeys = createQueryKeys('individuals', {
  list: (filterId: string) => ({
    queryKey: [{ filterId }],
    queryFn: () => fetchIndividuals(filterId),
  }),
  byId: (individualId: string, filterId: string) => ({
    queryKey: [{ individualId, filterId }],
    queryFn: () => fetchIndividualById(individualId, filterId),
  }),
});
