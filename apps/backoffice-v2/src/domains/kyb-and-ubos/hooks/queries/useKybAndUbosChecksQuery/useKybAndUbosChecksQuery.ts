import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { IKybAndUbosChecksParams } from '@/domains/kyb-and-ubos/fetchers';
import { kybAndUbosChecksQueryKey } from '@/domains/kyb-and-ubos/query-keys';

export const useKybAndUbosChecksQuery = ({ ...params }: IKybAndUbosChecksParams) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...kybAndUbosChecksQueryKey.list(params),
    enabled: isAuthenticated,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });
};
