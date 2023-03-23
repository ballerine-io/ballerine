import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TEndUsers } from 'src/api/types';
import { endUsers } from '../../end-users';

export const useEndUsersQuery = ({
  select,
}: {
  select?: UseQueryOptions<TEndUsers>['select'];
} = {}) => {
  return useQuery({
    ...endUsers.list(),
    select,
  });
};
