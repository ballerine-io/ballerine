import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { isString } from '../../../../utils/is-string/is-string';
import { TEndUser } from '../../../../api/types';
import { queries } from '../../queries';
import { useKind } from 'hooks/useKind/useKind';

export const useEndUserQuery = ({
  endUserId,
  select,
}: {
  endUserId: string;
  select?: UseQueryOptions<TEndUser>['select'];
}) => {
  const kind = useKind();

  return useQuery({
    ...queries[kind].byId(endUserId),
    enabled: isString(endUserId) && endUserId.length > 0,
    select,
  });
};
