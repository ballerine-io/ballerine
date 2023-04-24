import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TEndUsers } from 'src/api/types';
import { useKind } from 'hooks/useKind/useKind';
import { queries } from '../../queries';

export const useEndUsersQuery = ({
  select,
}: {
  select?: UseQueryOptions<TEndUsers>['select'];
} = {}) => {
  const kind = useKind();

  return useQuery({
    ...queries[kind].list(),
    select,
  });
};
