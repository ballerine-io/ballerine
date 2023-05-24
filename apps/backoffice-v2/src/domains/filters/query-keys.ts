import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchFilters } from './fetchers';

export const filtersQueryKeys = createQueryKeys('filters', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => fetchFilters(),
  }),
});
