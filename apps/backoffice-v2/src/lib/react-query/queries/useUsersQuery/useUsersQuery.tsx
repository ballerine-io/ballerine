import { useQuery } from '@tanstack/react-query';
import { users } from '../../users';
import { env } from '../../../../env/env';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useUsersQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...users.list(),
    enabled: isAuthenticated,
    refetchInterval: env.VITE_ASSIGNMENT_POLLING_INTERVAL,
  });
};
