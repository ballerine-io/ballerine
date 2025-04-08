import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { metricsQueryKeys } from '@/domains/metrics/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useHomeMetricsQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...metricsQueryKeys.home(),
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
};
