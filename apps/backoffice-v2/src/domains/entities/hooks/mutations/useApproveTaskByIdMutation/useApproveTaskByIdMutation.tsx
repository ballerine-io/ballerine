import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { fetchWorkflowDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';

export const useApproveTaskByIdMutation = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId }: { documentId: string }) =>
      fetchWorkflowDecision({
        workflowId,
        documentId,
        body: {
          decision: Action.APPROVE.toLowerCase(),
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:approve_document.success'));
    },
    onError: () => {
      toast.error(t('toast:approve_document.error'));
    },
  });
};
