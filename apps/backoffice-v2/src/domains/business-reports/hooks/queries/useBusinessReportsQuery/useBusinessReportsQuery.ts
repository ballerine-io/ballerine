import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';
import { useQuery } from '@tanstack/react-query';
import { TBusinessReportType } from '@/domains/business-reports/fetchers';

export const useBusinessReportsQuery = ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: TBusinessReportType;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...businessReportsQueryKey.list({ businessId, reportType }),
    enabled: isAuthenticated,
    staleTime: 100_000,
  });
};
