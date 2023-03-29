import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { isString } from '@/utils/is-string/is-string';
import { TEndUser } from '@/api/types';
import { endUsers } from '../../end-users';

export const useEndUserQuery = ({
  endUserId,
  select,
}: {
  endUserId: string;
  select?: UseQueryOptions<TEndUser>['select'];
}) => {
  return useQuery({
    ...endUsers.byId(endUserId),
    enabled: isString(endUserId) && endUserId.length > 0,
    select,
  });
};
