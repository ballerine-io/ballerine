import { useQuery } from '@tanstack/react-query';

import { MerchantReportType } from '@/domains/business-reports/constants';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';
import { TReportStatusValue, TRiskLevel } from '@/pages/MerchantMonitoring/schemas';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useBusinessReportsQuery = ({
  reportType,
  search,
  page,
  pageSize,
  sortBy,
  sortDir,
  riskLevels,
  statuses,
  findings,
  from,
  to,
}: {
  reportType?: MerchantReportType;
  search: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: string;
  riskLevels: TRiskLevel[];
  statuses: TReportStatusValue[];
  findings: string[];
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
      riskLevels,
      statuses,
      findings,
      from,
      to,
    }),
    enabled: isAuthenticated && !!sortBy && !!sortDir && !!page && !!pageSize,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });
};
