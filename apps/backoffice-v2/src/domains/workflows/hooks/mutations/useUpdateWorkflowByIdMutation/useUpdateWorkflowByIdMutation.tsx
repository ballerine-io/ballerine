import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { fetchUpdateWorkflowById, WorkflowByIdSchema } from '../../../fetchers';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { workflowsQueryKeys } from '../../../query-keys';
import { z } from 'zod';

export const useUpdateWorkflowByIdMutation = ({ workflowId }: { workflowId: string }) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const workflowById = workflowsQueryKeys.byId({ workflowId, filterId });

  return useMutation({
    mutationFn: ({
      context,
    }: {
      context: Record<PropertyKey, unknown>;
      action:
        | 'approve_document'
        | 'reject_document'
        | 'ask_resubmit_document'
        | 'update_document_properties';
    }) =>
      fetchUpdateWorkflowById({
        workflowId,
        body: {
          context,
        },
      }),
    onMutate: async ({ context }) => {
      await queryClient.cancelQueries({
        queryKey: workflowById.queryKey,
      });
      const previousWorkflow = queryClient.getQueryData(workflowById.queryKey);

      queryClient.setQueryData(
        workflowById.queryKey,
        (oldWorkflow: z.output<typeof WorkflowByIdSchema>) => {
          return {
            ...oldWorkflow,
            context: {
              ...oldWorkflow?.context,
              ...context,
            },
          };
        },
      );

      return { previousWorkflow };
    },
    onSuccess: (data, { action }) => {
      toast.success(t(`toast:${action}.success`));
    },
    onError: (error, { action }, context) => {
      toast.error(t(`toast:${action}.error`));
      queryClient.setQueryData(workflowById.queryKey, context.previousWorkflow);
    },
    onSettled: () => {
      void queryClient.invalidateQueries();
    },
  });
};
