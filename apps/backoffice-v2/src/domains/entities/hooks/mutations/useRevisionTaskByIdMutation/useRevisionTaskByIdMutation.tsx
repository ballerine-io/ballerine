import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { fetchWorkflowDecision, TWorkflowById } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';

export const useRevisionTaskByIdMutation = (workflowId: string) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const workflowById = workflowsQueryKeys.byId({ workflowId, filterId });

  return useMutation({
    mutationFn: ({ documentId, reason }: { documentId: string; reason?: string }) =>
      fetchWorkflowDecision({
        workflowId,
        documentId,
        body: {
          decision: Action.REVISION.toLowerCase(),
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
                  status: 'revision',
                  revisionReason: reason,
                  rejectionReason: null,
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

      toast.success(t('toast:ask_revision_document.success'));
    },
    onError: (_error, _variables, context) => {
      toast.error(t('toast:ask_revision_document.error'));
      queryClient.setQueryData(workflowById.queryKey, context.previousWorkflow);
    },
  });
};
