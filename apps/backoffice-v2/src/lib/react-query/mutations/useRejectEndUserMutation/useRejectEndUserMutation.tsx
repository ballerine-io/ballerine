import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { endUsers } from '../../end-users';
import { Action, Resource } from '../../../../enums';

export const useRejectEndUserMutation = (endUserId: string, onSelectNextEndUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.endUsers.updateById(endUserId, {
        // state: State.REJECTED,
        state: 'declined',
      }),
    onMutate: () => ({
      resource: Resource.END_USER,
      action: Action.REJECT,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: endUsers.list().queryKey });
      queryClient.invalidateQueries({
        queryKey: endUsers.byId(endUserId).queryKey,
      });

      onSelectNextEndUser();
    },
  });
};
