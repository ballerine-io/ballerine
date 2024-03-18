import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { TWorkflowById, updateWorkflowDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';

export const useRejectTaskByIdMutation = (workflowId: string) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const workflowById = workflowsQueryKeys.byId({ workflowId, filterId });

  return useMutation({
    mutationFn: ({ documentId, reason }: { documentId: string; reason?: string }) =>
      updateWorkflowDecision({
        workflowId,
        documentId,
        body: {
          decision: Action.REJECT,
          reason,
        },
      }),
    onMutate: async ({ documentId, reason }) => {
      await queryClient.cancelQueries({
        queryKey: workflowById.queryKey,
      });
      const previousWorkflow = queryClient.getQueryData(workflowById.queryKey);

      queryClient.setQueryData(workflowById.queryKey, (oldWorkflow: TWorkflowById) => {
        return {
          ...oldWorkflow,
          context: {
            ...oldWorkflow?.context,
            documents: oldWorkflow?.context?.documents?.map(document => {
              if (document?.id !== documentId) {
                return document;
              }

              return {
                ...document,
                decision: {
                  ...document?.decision,
                  status: 'rejected',
                  rejectionReason: reason,
                  revisionReason: null,
                },
              };
            }),
          },
        };
      });

      return { previousWorkflow };
    },
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:reject_document.success'));
    },
    onError: (_error, _variables, context) => {
      toast.error(t('toast:reject_document.error', { errorMessage: _error.message }));
      queryClient.setQueryData(workflowById.queryKey, context.previousWorkflow);
    },
  });
};
