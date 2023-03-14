import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { endUsers } from '../../end-users';
import { Action, Resource } from '../../../../enums';

export const useRejectEndUserMutation = ({
  endUserId,
  workflowId,
  onSelectNextEndUser,
}: {
  endUserId: string;
  workflowId: string;
  onSelectNextEndUser: VoidFunction;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.workflows.event({
        endUserId,
        workflowId,
        body: {
          name: 'REJECT',
        },
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
