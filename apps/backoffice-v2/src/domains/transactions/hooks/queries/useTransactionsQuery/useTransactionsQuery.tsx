import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { transactionsQueryKeys } from '@/domains/transactions/query-keys';

export const useTransactionsQuery = ({
  businessId,
  counterpartyOriginatorId,
  page,
  pageSize,
}: {
  businessId: string;
  counterpartyOriginatorId: string;
  page: number;
  pageSize: number;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...transactionsQueryKeys.list({
      businessId,
      counterpartyOriginatorId,
      page,
      pageSize,
    }),
    enabled: isAuthenticated && (!!businessId || !!counterpartyOriginatorId),
    staleTime: 100_000,
  });
};
