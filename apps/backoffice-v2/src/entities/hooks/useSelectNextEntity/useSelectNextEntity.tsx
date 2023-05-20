import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useCallback } from 'react';
import { entitiesRoute } from '../../../routes/Entities/Entities.route';
import { useNextEntityIdQuery } from '../queries/useNextEntityIdQuery/useNextEntityIdQuery';

export const useSelectNextEntity = () => {
  const { data: nextId } = useNextEntityIdQuery({
    initialState: {
      sortBy: 'createdAt',
    },
    routeId: entitiesRoute.fullPath,
  });
  const onSelectNextEntity = useSelectEntity();

  return useCallback(() => onSelectNextEntity(nextId)(), [onSelectNextEntity, nextId]);
};
