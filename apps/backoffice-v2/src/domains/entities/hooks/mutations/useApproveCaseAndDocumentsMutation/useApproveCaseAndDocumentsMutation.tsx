import { updateDocumentsDecisionByIds } from '@/domains/documents/fetchers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { toast } from 'sonner';
import { Action } from '../../../../../common/enums';
import { fetchWorkflowEventDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';

export const useApproveCaseAndDocumentsMutation = ({
  isDocumentsV2,
}: {
  isDocumentsV2: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, workflowId }: { ids: string[]; workflowId: string }) => {
      if (isDocumentsV2) {
        await updateDocumentsDecisionByIds({
          ids,
          data: {
            decision: Action.APPROVE,
          },
        });
      }

      return fetchWorkflowEventDecision({
        workflowId,
        body: {
          name: Action.APPROVE,
        },
      });
    },
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
