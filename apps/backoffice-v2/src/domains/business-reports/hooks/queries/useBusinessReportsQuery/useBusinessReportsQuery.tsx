import { TBusinessReportType } from '@/domains/business-reports/types';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';
import { isString } from '@/common/utils/is-string/is-string';

export const useBusinessReportsQuery = ({ reportType }: { reportType: TBusinessReportType }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...businessReportsQueryKey.list({ reportType }),
    enabled: isAuthenticated && isString(reportType) && !!reportType,
    staleTime: 100_000,
  });
};
