import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';
import { workflows } from '../../workflows';

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
      resource: Resource.END_USER,
      action: Action.APPROVE,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workflows.list().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: workflows.byId({ workflowId }).queryKey,
      });
    },
  });
};
