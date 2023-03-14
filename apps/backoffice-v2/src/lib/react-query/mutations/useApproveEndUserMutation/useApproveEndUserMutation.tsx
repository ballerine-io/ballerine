import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { endUsers } from '../../end-users';
import { Action, Resource } from '../../../../enums';

export const useApproveEndUserMutation = ({
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
          name: 'APPROVE',
        },
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
