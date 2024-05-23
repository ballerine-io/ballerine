import { alertsQueryKeys } from '@/domains/alerts/query-keys';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';

export const useAlertsQuery = ({
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
    ...alertsQueryKeys.list({ filter, sortBy, sortDir, page, pageSize, search }),
    enabled: isAuthenticated && !!sortBy && !!sortDir && !!page && !!pageSize,
    staleTime: 100_000,
  });
};
