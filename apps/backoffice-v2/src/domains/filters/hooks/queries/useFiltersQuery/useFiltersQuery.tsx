import { useQuery } from '@tanstack/react-query';
import { filtersQueryKeys } from '../../../query-keys';

export const useFiltersQuery = (websocketConnectionIsOpen: boolean) => {
  return useQuery({
    ...filtersQueryKeys.list(),
    staleTime: 1_000_000,
    refetchInterval: () => (websocketConnectionIsOpen ? false : 1_000_000),
  });
};
