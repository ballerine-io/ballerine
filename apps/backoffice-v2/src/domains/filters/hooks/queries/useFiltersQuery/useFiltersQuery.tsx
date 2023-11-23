import { useQuery } from '@tanstack/react-query';
import { filtersQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useFiltersQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...filtersQueryKeys.list(),
    staleTime: 1_000_000,
    refetchInterval: 1_000_000,
    enabled: isAuthenticated,
  });
};
