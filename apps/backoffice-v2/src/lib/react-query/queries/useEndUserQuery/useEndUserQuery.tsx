import { useQuery } from '@tanstack/react-query';
import { endUsers } from '../../end-users';

export const useEndUserQuery = (endUserId: string) => {
  return useQuery(endUsers.byId(endUserId));
};
