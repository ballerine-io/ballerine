import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { fetchWorkflowEventDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';

export const useApproveCaseAndDocumentsMutation = ({ workflowId }: { workflowId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchWorkflowEventDecision({
        workflowId,
        body: {
          name: Action.APPROVE,
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:approve_case.success'));
    },
    onError: () => {
      toast.error(t('toast:approve_case.error'));
    },
  });
};
