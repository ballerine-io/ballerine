import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { endUsers } from '../../end-users';
import { Action, Resource, State } from '../../../../enums';

export const useApproveEndUserMutation = (endUserId: string, onSelectNextEndUser: VoidFunction) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.endUsers.updateById(endUserId, {
        state: State.APPROVED,
      }),
    onMutate: () => ({
      resource: Resource.END_USER,
      action: Action.APPROVE,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: endUsers.list().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: endUsers.byId(endUserId).queryKey,
      });

      onSelectNextEndUser();
    },
  });
};
