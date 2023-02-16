import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { endUsers } from '../../end-users';
import { Action, Resource, State } from '../../../../enums';

export const useRejectEndUserMutation = (
  endUserId: string,
  onSelectNextEndUser,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.endUsers.updateById(endUserId, {
        state: State.REJECTED,
      }),
    onMutate: () => ({
      resource: Resource.END_USER,
      action: Action.REJECT,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(endUsers.list().queryKey);
      queryClient.invalidateQueries(endUsers.byId(endUserId).queryKey);

      onSelectNextEndUser();
    },
  });
};
