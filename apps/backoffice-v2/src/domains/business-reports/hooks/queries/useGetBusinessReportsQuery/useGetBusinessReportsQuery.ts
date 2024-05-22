import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useGetBusinessReportsQuery = ({ businessId }: { businessId: string }) => {
  const isAuthenticated = useIsAuthenticated();

  console.log('QUERY');

  return useQuery({
    ...businessReportsQueryKey.ongoingReportsList({ businessId }),
    enabled: isAuthenticated,
    staleTime: 100_000,
  });
};
