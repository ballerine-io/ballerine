import { TBusinessReportType } from '@/domains/business-reports/types';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';
import { isString } from '@/common/utils/is-string/is-string';

export const useBusinessReportsQuery = ({
  reportType,
  page,
  pageSize,
  sortBy,
  sortDir,
}: {
  reportType: TBusinessReportType;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: string;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...businessReportsQueryKey.list({ reportType, page, pageSize, sortBy, sortDir }),
    enabled:
      isAuthenticated &&
      isString(reportType) &&
      !!reportType &&
      !!sortBy &&
      !!sortDir &&
      !!page &&
      !!pageSize,
    staleTime: 100_000,
  });
};
