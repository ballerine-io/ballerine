import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';

export const useUpdateWorkflowByIdMutation = ({ workflowId }: { workflowId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ context }: { context: Record<PropertyKey, unknown> }) =>
      api.workflows.updateById({
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
      queryClient.invalidateQueries();
    },
  });
};
