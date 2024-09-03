import { fetchFiltersList } from '@/domains/filters/filters.api';
import { GetFiltersListDto } from '@/domains/filters/filters.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const filtersQueryKeys = createQueryKeys('filters', {
  list: (query: GetFiltersListDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchFiltersList(query),
  }),
});
