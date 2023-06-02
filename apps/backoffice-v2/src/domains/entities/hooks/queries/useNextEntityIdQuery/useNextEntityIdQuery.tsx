import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { sort } from '../../../../../common/hooks/useSort/sort';
import { useSelectEntitiesQuery } from '../useSelectEntitiesQuery/useSelectEntitiesQuery';
import { TEntities } from '../../../types';
import { z } from 'zod';
import { useZodSearchParams } from '../../../../../common/hooks/useZodSearchParams/useZodSearchParams';

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
    useZodSearchParams(
      z.object({
        sortBy: z.string().catch(''),
        sortDir: z.union([z.literal('asc'), z.literal('desc')]).catch('desc'),
      }),
    );
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
