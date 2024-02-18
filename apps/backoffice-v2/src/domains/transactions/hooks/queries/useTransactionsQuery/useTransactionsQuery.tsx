import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { transactionsQueryKeys } from '@/domains/transactions/query-keys';

export const useTransactionsQuery = ({
  businessId,
  page,
  pageSize,
}: {
  businessId: string;
  page: number;
  pageSize: number;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...transactionsQueryKeys.list({
      businessId,
      page,
      pageSize,
    }),
    enabled: isAuthenticated && !!businessId,
    staleTime: 100_000,
  });
};
