import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action, Resource } from '../../../../enums';
import { fetchUpdateWorkflowById } from '../../../fetchers';

export const useUpdateWorkflowByIdMutation = ({ workflowId }: { workflowId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ context }: { context: Record<PropertyKey, unknown> }) =>
      fetchUpdateWorkflowById({
        workflowId,
        body: {
          context,
        },
      }),
    onMutate: () => ({
      resource: Resource.INDIVIDUAL,
      action: Action.APPROVE,
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
};
