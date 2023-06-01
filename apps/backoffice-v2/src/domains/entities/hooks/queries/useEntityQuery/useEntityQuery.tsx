import { useQuery } from '@tanstack/react-query';
import { isString } from '../../../../../common/utils/is-string/is-string';
import { queryKeys } from '../../../query-keys';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { TEntity } from '../../../types';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useEntityQuery = <TQueryFnData = TEntity,>({
  entityId,
  select,
}: {
  entityId: string;
  select?: (data: TEntity) => TQueryFnData;
}) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...queryKeys[entity as keyof typeof queryKeys].byId(entityId, filterId),
    enabled: isString(entityId) && !!entityId?.length && !!filterId && isAuthenticated,
    select,
  });
};
