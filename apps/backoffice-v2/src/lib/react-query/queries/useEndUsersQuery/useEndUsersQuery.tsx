import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TEndUsers } from 'src/api/types';
import { useKind } from 'hooks/useKind/useKind';
import { queries } from '../../queries';
import { useFilterId } from 'hooks/useFilterId/useFilterId';

export const useEndUsersQuery = ({
  select,
}: {
  select?: UseQueryOptions<TEndUsers>['select'];
} = {}) => {
  const kind = useKind();
  const filterId = useFilterId();

  return useQuery({
    ...queries[kind].list(filterId),
    select,
  });
};
