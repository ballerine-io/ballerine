import { TEndUsers } from '../../../../api/types';
import { useQuery } from '@tanstack/react-query';
import { endUsers } from '../../end-users';

export const useSelectEndUsersQuery = <TQueryFnData,>(
  select: (data: TEndUsers) => TQueryFnData,
) => {
  return useQuery({
    ...endUsers.list(),
    select,
  });
};
