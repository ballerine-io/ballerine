import { customerQueryKeys } from '../../../query-keys';
import { useQuery } from '@tanstack/react-query';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useCustomerQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...customerQueryKeys.getCurrent(),
    staleTime: 1_000_000,
    refetchInterval: 1_000_000,
    enabled: isAuthenticated,
  });
};
