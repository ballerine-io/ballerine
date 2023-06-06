import { queryClient } from '../../../lib/react-query/query-client';
import { filtersQueryKeys } from '../../../domains/filters/query-keys';
import { TFilter } from 'src/domains/filters/types';

export function getFiltersFromQuery(): TFilter[] {
  const [_, result] = queryClient.getQueriesData(filtersQueryKeys.list())[0];

  return (result ? result : []) as TFilter[];
}
