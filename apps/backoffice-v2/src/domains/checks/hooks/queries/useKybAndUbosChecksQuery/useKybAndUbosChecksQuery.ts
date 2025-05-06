import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { IKybAndUbosChecksParams } from '@/domains/checks/fetchers';
import { kybAndUbosChecksQueryKey } from '@/domains/checks/query-keys';

export const useKybAndUbosChecksQuery = ({ ...params }: IKybAndUbosChecksParams) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...kybAndUbosChecksQueryKey.list(params),
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });
};
