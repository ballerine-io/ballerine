import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { endUsers } from '../../end-users';
import { Action, Resource } from '../../../../enums';
import { sleep } from '@ballerine/common';

export const useRejectEndUserMutation = ({
  workflowId,
  endUserId,
  onSelectNextEndUser,
}: {
  workflowId: string;
  endUserId: string;
  onSelectNextEndUser: VoidFunction;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.workflows.event({
        workflowId,
        body: {
          name: 'reject',
        },
      }),
    onMutate: () => ({
      resource: Resource.END_USER,
      action: Action.REJECT,
    }),
    onSuccess: async () => {
      await sleep(3000);
      queryClient.invalidateQueries({ queryKey: endUsers.list().queryKey });
      queryClient.invalidateQueries({
        queryKey: endUsers.byId(endUserId).queryKey,
      });

      onSelectNextEndUser();
    },
  });
};
