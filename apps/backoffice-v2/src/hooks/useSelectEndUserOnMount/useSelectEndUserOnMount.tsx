import { useEffect } from 'react';
import { useFirstEndUserIdQuery } from '../../lib/react-query/queries/useFirstEndUserIdQuery/useFirstEndUserIdQuery';
import { individualsRoute } from 'components/pages/Individuals/Individuals.route';
import { useSelectEndUser } from 'hooks/useSelectEndUser/useSelectEndUser';
import { useParams } from '@tanstack/react-router';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';

/**
 * @description Sets the selected end user to the first end user in the array on mount if no user is currently selected. Returns the select end user handler.
 */
export const useSelectEndUserOnMount = () => {
  const { endUserId } = useParams();
  const { data: firstEndUserId } = useFirstEndUserIdQuery({
    initialState: {
      sortBy: 'caseCreatedAt',
    },
    routeId: individualsRoute.id,
  });
  const onSelectEndUser = useSelectEndUser();
  const entity = useFilterEntity();

  useEffect(() => {
    if (!firstEndUserId || endUserId) return;

    onSelectEndUser(firstEndUserId)();
  }, [entity, firstEndUserId, endUserId]);
};
