import { useQuery } from '@tanstack/react-query';
import { MerchantReportType } from '@ballerine/common';

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
  isAlert,
}: {
  reportType?: MerchantReportType;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  riskLevels?: TRiskLevel[];
  statuses?: TReportStatusValue[];
  findings?: string[];
  from?: string;
  to?: string;
  isAlert?: boolean;
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
      isAlert,
    }),
    enabled: isAuthenticated,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });
};
