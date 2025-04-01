import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { metricsQueryKeys } from '@/domains/metrics/query-keys';

export const useCaseDailyStats = ({ id }: { id: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...metricsQueryKeys.caseDailyStats({ id }),
    enabled: !!id && isAuthenticated,
    staleTime: 100_000,
  });
};
