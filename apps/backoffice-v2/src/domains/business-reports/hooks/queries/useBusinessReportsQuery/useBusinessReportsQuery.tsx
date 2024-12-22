import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';
import { isString } from '@/common/utils/is-string/is-string';
import { MerchantReportType } from '@/domains/business-reports/constants';
import dayjs from 'dayjs';

export const useBusinessReportsQuery = ({
  reportType,
  search,
  page,
  pageSize,
  sortBy,
  sortDir,
  from,
  to,
}: {
  reportType: MerchantReportType;
  search: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: string;
  from?: string;
  to?: string;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...businessReportsQueryKey.list({
      reportType,
      search,
      page,
      pageSize,
      sortBy,
      sortDir,
      from,
      to: to ? dayjs(to).add(1, 'day').format('YYYY-MM-DD') : undefined,
    }),
    enabled:
      isAuthenticated &&
      isString(reportType) &&
      !!reportType &&
      !!sortBy &&
      !!sortDir &&
      !!page &&
      !!pageSize,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });
};
