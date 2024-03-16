import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { alertsQueryKeys } from '@/domains/alerts/query-keys';

export const useAlertLabelsQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...alertsQueryKeys.alertLabels(),
    enabled: isAuthenticated,
    staleTime: 100_000,
  });
};
