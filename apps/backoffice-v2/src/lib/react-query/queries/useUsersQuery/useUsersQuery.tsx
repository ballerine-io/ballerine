import { useQuery } from '@tanstack/react-query';
import { users } from '../../users';

export const useUsersQuery =  () => {
  return useQuery(users.list());
};
