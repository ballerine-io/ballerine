import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useCallback } from 'react';
import { individualsRoute } from 'components/pages/Individuals/Individuals.route';
import { useNextEntityIdQuery } from '../queries/useNextEntityIdQuery/useNextEntityIdQuery';

export const useSelectNextEntity = () => {
  const { data: nextId } = useNextEntityIdQuery({
    initialState: {
      sortBy: 'createdAt',
    },
    routeId: individualsRoute.fullPath,
  });
  const onSelectNextEntity = useSelectEntity();

  return useCallback(() => onSelectNextEntity(nextId)(), [onSelectNextEntity, nextId]);
};
