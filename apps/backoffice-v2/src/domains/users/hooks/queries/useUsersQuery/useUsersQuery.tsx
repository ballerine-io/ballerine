import { useQuery } from '@tanstack/react-query';
import { usersQueryKeys } from '../../../query-keys';

export const useUsersQuery = () => {
  return useQuery(usersQueryKeys.list());
};
