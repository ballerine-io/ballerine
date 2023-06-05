import { entitiesRoute } from '../../../../routes/Entities/Entities.route';
import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useNextEntityIdQuery } from '../queries/useNextEntityIdQuery/useNextEntityIdQuery';
import { useCallback } from 'react';

export const useSelectNextEntity = () => {
  const { data: nextId } = useNextEntityIdQuery({
    initialState: {
      sortBy: 'caseCreatedAt',
    },
    routeId: entitiesRoute.fullPath,
  });
  const onSelectNextEntity = useSelectEntity();

  return useCallback(() => onSelectNextEntity(nextId)(), [onSelectNextEntity, nextId]);
};
