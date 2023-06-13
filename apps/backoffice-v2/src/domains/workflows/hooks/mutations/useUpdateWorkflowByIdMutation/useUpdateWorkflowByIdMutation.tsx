import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { fetchUpdateWorkflowById } from '../../../fetchers';
import { useWorkflowQuery } from '../../queries/useWorkflowQuery/useWorkflowQuery';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';

export const useUpdateWorkflowByIdMutation = ({ workflowId }: { workflowId: string }) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const { data: workflowById } = useWorkflowQuery({ workflowId, filterId });

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

      queryClient.setQueryData(workflowById.queryKey, oldWorkflow => {
        return {
          ...oldWorkflow,
          workflowRuntimeData: {
            ...oldWorkflow?.workflowRuntimeData,
            context: {
              ...oldWorkflow?.workflowRuntimeData?.context,
              ...context,
            },
          },
        };
      });

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
