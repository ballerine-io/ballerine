import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { metricsQueryKeys } from '@/domains/metrics/query-keys';

export const useCaseDailyStats = ({ from, to }: { from?: string; to?: string } = {}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...metricsQueryKeys.caseDailyStats({ from, to }),
    enabled: isAuthenticated,
    staleTime: 100_000,
  });
};
