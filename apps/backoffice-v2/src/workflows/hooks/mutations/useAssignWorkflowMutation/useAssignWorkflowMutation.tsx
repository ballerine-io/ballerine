import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action, Resource } from '../../../../enums';
import { fetchUpdateWorkflowById } from '../../../fetchers';

export const useAssignWorkflowMutation = ({ workflowRuntimeId }: { workflowRuntimeId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assigneeId,
      // isAssignedToMe is passed to mutationFn so it can be accessed in onMutate.
      isAssignedToMe: _isAssignedToMe,
    }: {
      assigneeId: string;
      isAssignedToMe: boolean;
    }) =>
      fetchUpdateWorkflowById({
        workflowId: workflowRuntimeId,
        body: {
          assigneeId,
        },
      }),
    onMutate: ({ isAssignedToMe }) => ({
      resource: Resource.ASSIGNMENT,
      action: isAssignedToMe ? Action.ASSIGNED_TO_ME : Action.ASSIGNED_TO_OTHER,
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
};
