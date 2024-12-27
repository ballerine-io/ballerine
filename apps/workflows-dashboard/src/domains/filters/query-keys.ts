import { createFilter, fetchFiltersList } from '@/domains/filters/filters.api';
import { CreateFilterDto, GetFiltersListDto } from '@/domains/filters/filters.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const filtersQueryKeys = createQueryKeys('filters', {
  list: (query: GetFiltersListDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchFiltersList(query),
  }),
  create: () => ({
    queryKey: ['create'],
    queryFn: (dto: CreateFilterDto) => createFilter(dto),
  }),
});
