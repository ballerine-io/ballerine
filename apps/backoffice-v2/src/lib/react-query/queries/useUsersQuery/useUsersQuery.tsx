import { useQuery } from '@tanstack/react-query';
import { users } from '../../users';

export const useUsersQuery = () => {
  return useQuery({
    ...users.list(),
    // 1 second(s)
    refetchInterval: 1 * 1000,
  });
};
