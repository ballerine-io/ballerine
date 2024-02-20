import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { transactionsQueryKeys } from '@/domains/transactions/query-keys';

export const useTransactionsQuery = ({
  businessId,
  counterpartyId,
  page,
  pageSize,
}: {
  businessId: string;
  counterpartyId: string;
  page: number;
  pageSize: number;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...transactionsQueryKeys.list({
      businessId,
      counterpartyId,
      page,
      pageSize,
    }),
    enabled: isAuthenticated && (!!businessId || !!counterpartyId),
    staleTime: 100_000,
  });
};
