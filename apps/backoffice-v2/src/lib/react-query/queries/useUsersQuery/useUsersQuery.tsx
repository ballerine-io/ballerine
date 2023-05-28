import { useQuery } from '@tanstack/react-query';
import { users } from '../../users';
import { env } from '../../../../env/env';

export const useUsersQuery = () => {
  return useQuery({
    ...users.list(),
    refetchInterval: env.VITE_ASSIGNMENT_POLLING_INTERVAL,
  });
};
