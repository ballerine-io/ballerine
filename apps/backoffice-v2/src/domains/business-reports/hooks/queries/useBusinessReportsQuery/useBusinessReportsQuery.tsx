import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

import { isString } from '@/common/utils/is-string/is-string';
import { MerchantReportType } from '@/domains/business-reports/constants';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';
import { TReportStatus, TRiskLevel } from '@/pages/MerchantMonitoring/schemas';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useBusinessReportsQuery = ({
  reportType,
  search,
  page,
  pageSize,
  sortBy,
  sortDir,
  riskLevel,
  statuses,
  from,
  to,
}: {
  reportType: MerchantReportType | 'All';
  search: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: string;
  riskLevel: TRiskLevel[];
  statuses: TReportStatus[];
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
      riskLevel,
      statuses,
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
