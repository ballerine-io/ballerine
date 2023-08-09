import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { fetchWorkflowDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';

export const useRejectTaskByIdMutation = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, reason }: { documentId: string; reason?: string }) =>
      fetchWorkflowDecision({
        workflowId,
        documentId,
        body: {
          decision: Action.REJECT.toLowerCase(),
          reason,
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:reject_document.success'));
    },
    onError: () => {
      toast.error(t('toast:reject_document.error'));
    },
  });
};
