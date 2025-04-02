import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { metricsQueryKeys } from '@/domains/metrics/query-keys';

export const useCaseDailyStats = (params: { from?: string; to?: string }) => {
  const isAuthenticated = useIsAuthenticated();
  const { from, to } = params;

  return useQuery({
    ...metricsQueryKeys.caseDailyStats(params as { from: string; to: string }),
    enabled: !!from && !!to && isAuthenticated,
    staleTime: 100_000,
  });
};
