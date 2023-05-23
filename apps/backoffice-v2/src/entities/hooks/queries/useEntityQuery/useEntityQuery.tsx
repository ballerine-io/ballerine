import { useQuery } from '@tanstack/react-query';
import { isString } from '../../../../utils/is-string/is-string';
import { queryKeys } from '../../../query-keys';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { TEntity } from '../../../types';

export const useEntityQuery = <TQueryFnData = TEntity,>({
  entityId,
  select,
}: {
  entityId: string;
  select?: (data: TEntity) => TQueryFnData;
}) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();

  return useQuery({
    ...queryKeys[entity as keyof typeof queryKeys].byId(entityId, filterId),
    enabled: isString(entityId) && !!entityId?.length,
    select,
  });
};
