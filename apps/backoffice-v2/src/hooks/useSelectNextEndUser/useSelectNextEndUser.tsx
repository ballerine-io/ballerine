import { useNextEndUserIdQuery } from '@/lib/react-query/queries/useNextEndUserIdQuery/useNextEndUserIdQuery';
import { individualRoute } from '@/components/pages/Individual/Individual.route';
import { useSelectEndUser } from '@/hooks/useSelectEndUser/useSelectEndUser';
import { useCallback } from 'react';

export const useSelectNextEndUser = () => {
  const { data: nextId } = useNextEndUserIdQuery({
    initialState: {
      sortBy: 'createdAt',
    },
    routeId: individualRoute.id,
  });
  const onSelectNextUser = useSelectEndUser();

  return useCallback(() => onSelectNextUser(nextId)(), [onSelectNextUser, nextId]);
};
