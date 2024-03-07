import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { transactionsQueryKeys } from '@/domains/transactions/query-keys';

export const useTransactionsQuery = ({
  counterpartyId,
  page,
  pageSize,
}: {
  counterpartyId: string;
  page: number;
  pageSize: number;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...transactionsQueryKeys.list({
      counterpartyId,
      page,
      pageSize,
    }),
    enabled: isAuthenticated && !!counterpartyId,
    staleTime: 100_000,
  });
};
