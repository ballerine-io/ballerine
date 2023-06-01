import { useParams, useSearch as useTanStackSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { sort } from '../../../../../common/hooks/useSort/sort';
import { TRouteId } from '../../../../../common/types';
import { useSelectEntitiesQuery } from '../useSelectEntitiesQuery/useSelectEntitiesQuery';
import { TEntities } from '../../../types';

export const useNextEntityIdQuery = <TId extends TRouteId>({
  initialState,
  routeId,
}: {
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: keyof TEntities[number];
  };
  routeId: TId;
}) => {
  const { entityId } = useParams();
  const { sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' } =
    useTanStackSearch({
      from: routeId,
      strict: false,
      track: searchParams => ({
        sortBy: 'sortBy' in searchParams ? searchParams?.sortBy : undefined,
        sortDir: 'sortDir' in searchParams ? searchParams?.sortDir : undefined,
      }),
    });
  const selectNextEntityId = useCallback(
    (data: TEntities) => {
      if (!entityId) return;

      const sorted = sort({ data, sortBy, sortDir });
      const nextEntityIndex = sorted?.findIndex(entity => entity.id === entityId) + 1;

      return sorted?.[nextEntityIndex]?.id;
    },
    [entityId, sortBy, sortDir],
  );

  return useSelectEntitiesQuery(selectNextEntityId);
};
