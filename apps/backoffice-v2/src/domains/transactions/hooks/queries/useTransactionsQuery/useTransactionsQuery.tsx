import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { transactionsQueryKeys } from '@/domains/transactions/query-keys';

export const useTransactionsQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...transactionsQueryKeys.list(),
    enabled: isAuthenticated,
    staleTime: 100_000,
  });
};
