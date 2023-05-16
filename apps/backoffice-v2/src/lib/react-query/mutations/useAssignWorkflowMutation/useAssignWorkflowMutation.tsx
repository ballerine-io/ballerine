import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';

export const useAssignWorkflowMutation = ({
  workflowRuntimeId
}: {
  workflowRuntimeId: string,
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assigneeId,
      isAssignedToMe
    }: {
      assigneeId: string,
      isAssignedToMe: boolean
    }) =>
      api.workflows.updateById({
        workflowId: workflowRuntimeId,
        body: {
          assigneeId
        },
      }),
    onMutate: ({
      isAssignedToMe
    }) => ({
      resource: Resource.END_USER,
      action:  isAssignedToMe ? Action.ASSIGNED_TO_ME : Action.ASSIGNED_TO_OTHER,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};
