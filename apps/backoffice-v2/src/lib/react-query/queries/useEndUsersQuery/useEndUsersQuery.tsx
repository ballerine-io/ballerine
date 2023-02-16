import { useQuery } from '@tanstack/react-query';
import { endUsers } from '../../end-users';

export const useEndUsersQuery = () => {
  return useQuery(endUsers.list());
};
