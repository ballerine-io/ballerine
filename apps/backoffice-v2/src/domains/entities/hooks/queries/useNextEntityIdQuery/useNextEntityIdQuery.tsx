import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { sort } from '../../../../../common/hooks/useSort/sort';
import { useSelectEntitiesQuery } from '../useSelectEntitiesQuery/useSelectEntitiesQuery';
import { TEntities } from '../../../types';
import { useSearchParamsByEntity } from '../../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';

export const useNextEntityIdQuery = ({
  initialState,
}: {
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: keyof TEntities[number];
  };
}) => {
  const { entityId } = useParams();
  const [{ sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' }] =
    useSearchParamsByEntity();
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
