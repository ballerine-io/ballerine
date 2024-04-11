import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { isString } from '@/common/utils/is-string/is-string';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';

export const useLatestBusinessReportQuery = ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: 'ONGOING_MERCHANT_REPORT_T1' & (string & {});
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...businessReportsQueryKey.latest({ businessId, reportType }),
    enabled:
      isAuthenticated &&
      isString(businessId) &&
      !!businessId &&
      isString(reportType) &&
      !!reportType,
    staleTime: 100_000,
  });
};
