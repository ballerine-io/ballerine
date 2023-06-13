import { queryClient } from '../../../lib/react-query/query-client';
import { filtersQueryKeys } from '../../../domains/filters/query-keys';
import { TFilter } from 'src/domains/filters/types';

export function getFiltersFromQuery(): TFilter[] {
  const filters = queryClient.getQueryData<TFilter[]>(filtersQueryKeys.list().queryKey);

  return filters ? filters : [];
}
