import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { alertsQueryKeys } from '@/domains/alerts/query-keys';
import { AlertEntityType } from '@/domains/alerts/fetchers';

export const useAlertsQuery = ({
  sortBy,
  sortDir,
  page,
  pageSize,
  search,
  filter,
  entityType,
}: {
  sortBy: string;
  sortDir: string;
  page: number;
  pageSize: number;
  search: string;
  filter: Record<string, unknown>;
  entityType: AlertEntityType;
}) => {
  const isAuthenticated = useIsAuthenticated();
  debugger;
  return useQuery({
    ...alertsQueryKeys.list({ filter, sortBy, sortDir, page, pageSize, search, entityType }),
    enabled: isAuthenticated && !!sortBy && !!sortDir && !!page && !!pageSize,
    staleTime: 100_000,
  });
};
