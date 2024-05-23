import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { businessAlertsQueryKeys } from '@/domains/business-alerts/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useBusinessAlertsQuery = ({
  sortBy,
  sortDir,
  page,
  pageSize,
  search,
  filter,
}: {
  sortBy: string;
  sortDir: string;
  page: number;
  pageSize: number;
  search: string;
  filter: Record<string, unknown>;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...businessAlertsQueryKeys.list({
      filter,
      sortBy,
      sortDir,
      page,
      pageSize,
      search,
    }),
    enabled: isAuthenticated && !!sortBy && !!sortDir && !!page && !!pageSize,
    staleTime: 100_000,
  });
};
