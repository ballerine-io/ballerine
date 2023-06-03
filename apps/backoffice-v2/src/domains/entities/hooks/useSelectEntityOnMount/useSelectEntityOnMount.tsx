import { useEffect } from 'react';
import { useFirstEntityIdQuery } from '../queries/useFirstEntityIdQuery/useFirstEntityIdQuery';
import { useParams } from 'react-router-dom';
import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useFilterEntity } from '../useFilterEntity/useFilterEntity';

/**
 * @description Sets the selected end user to the first end user in the array on mount if no user is currently selected. Returns the select end user handler.
 */
export const useSelectEntityOnMount = () => {
  const { entityId } = useParams();
  const { data: firstEntityId } = useFirstEntityIdQuery({
    initialState: {
      sortBy: 'caseCreatedAt',
    },
  });
  const onSelectEntity = useSelectEntity();
  const entity = useFilterEntity();

  useEffect(() => {
    if (!firstEntityId || entityId) return;

    onSelectEntity(firstEntityId)();
  }, [entity, firstEntityId, entityId, onSelectEntity]);
};
