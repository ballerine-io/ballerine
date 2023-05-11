import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { isString } from '../../../../utils/is-string/is-string';
import { TEndUser } from '../../../../api/types';
import { queries } from '../../queries';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';

export const useEndUserQuery = ({
  endUserId,
  select,
}: {
  endUserId: string;
  select?: UseQueryOptions<TEndUser>['select'];
}) => {
  const entity = useFilterEntity();

  return useQuery({
    ...queries[entity].byId(endUserId),
    enabled: isString(endUserId) && endUserId.length > 0,
    select,
  });
};
