import { useQuery } from '@tanstack/react-query';
import { filtersQueryKeys } from '../../../query-keys';

export const useFiltersQuery = () => {
  return useQuery({
    ...filtersQueryKeys.list(),
    staleTime: 1_000_000,
    refetchInterval: 1_000_000,
  });
};
