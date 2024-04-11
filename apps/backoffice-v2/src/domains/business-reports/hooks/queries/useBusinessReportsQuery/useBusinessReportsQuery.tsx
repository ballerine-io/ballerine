import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { isString } from '@/common/utils/is-string/is-string';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';

export const useBusinessReportsQuery = ({ businessId }: { businessId: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...businessReportsQueryKey.list({ businessId }),
    enabled: isAuthenticated && isString(businessId) && !!businessId,
    staleTime: 100_000,
  });
};
