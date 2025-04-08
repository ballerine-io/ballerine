import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { metricsQueryKeys } from '@/domains/metrics/query-keys';

export const useCaseCurrentStats = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...metricsQueryKeys.caseStats(),
    enabled: isAuthenticated,
    staleTime: 100_000,
  });
};
