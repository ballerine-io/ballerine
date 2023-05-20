import { useEffect } from 'react';

import { individualsRoute } from 'components/pages/Individuals/Individuals.route';
import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useFilterEntity } from '../useFilterEntity/useFilterEntity';
import { useFirstEntityIdQuery } from '../queries/useFirstEntityIdQuery/useFirstEntityIdQuery';

/**
 * @description Sets the selected entity to the first entity in the array on mount if no user is currently selected. Returns the select entity handler.
 */
export const useSelectEntityOnMount = () => {
  const { data: firstEntityId } = useFirstEntityIdQuery({
    initialState: {
      sortBy: 'createdAt',
    },
    routeId: individualsRoute.id,
  });
  const onSelectEntity = useSelectEntity();
  const entity = useFilterEntity();

  useEffect(() => {
    if (!firstEntityId) return;

    onSelectEntity(firstEntityId)();
  }, [entity]);
};
