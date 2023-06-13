import { useQuery } from '@tanstack/react-query';
import { usersQueryKeys } from '../../../query-keys';
import { env } from '../../../../../common/env/env';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useUsersQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...usersQueryKeys.list(),
    enabled: isAuthenticated,
    refetchInterval: env.VITE_ASSIGNMENT_POLLING_INTERVAL,
    staleTime: 1_000_000,
  });
};
