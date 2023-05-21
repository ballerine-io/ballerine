import { useNextEndUserIdQuery } from '../../lib/react-query/queries/useNextEndUserIdQuery/useNextEndUserIdQuery';
import { useSelectEndUser } from 'hooks/useSelectEndUser/useSelectEndUser';
import { useCallback } from 'react';
import { individualsRoute } from 'components/pages/Individuals/Individuals.route';

export const useSelectNextEndUser = () => {
  const { data: nextId } = useNextEndUserIdQuery({
    initialState: {
      sortBy: 'caseCreatedAt',
    },
    routeId: individualsRoute.fullPath,
  });
  const onSelectNextUser = useSelectEndUser();

  return useCallback(() => onSelectNextUser(nextId)(), [onSelectNextUser, nextId]);
};
