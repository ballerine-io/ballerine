import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';
import { isString } from '@/common/utils/is-string/is-string';

export const useBusinessReportByIdQuery = ({ id }: { id: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...businessReportsQueryKey.byId({ id }),
    enabled: isAuthenticated && isString(id) && !!id.length,
    staleTime: 100_000,
  });
};
