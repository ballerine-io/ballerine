import { useQuery } from '@tanstack/react-query';
import { usersQueryKeys } from '../../../query-keys';
import { env } from '../../../../../common/env/env';

export const useUsersQuery = () => {
  return useQuery({
    ...usersQueryKeys.list(),
    refetchInterval: env.VITE_ASSIGNMENT_POLLING_INTERVAL,
  });
};
