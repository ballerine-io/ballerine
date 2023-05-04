import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const filters = createQueryKeys('filters', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => api.filters.list(),
  }),
});
