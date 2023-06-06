import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useNextEntityIdQuery } from '../queries/useNextEntityIdQuery/useNextEntityIdQuery';
import { useCallback } from 'react';

export const useSelectNextEntity = () => {
  const { data: nextId } = useNextEntityIdQuery({
    initialState: {
      sortBy: 'caseCreatedAt',
    },
  });
  const onSelectNextEntity = useSelectEntity();

  return useCallback(() => onSelectNextEntity(nextId)(), [onSelectNextEntity, nextId]);
};
