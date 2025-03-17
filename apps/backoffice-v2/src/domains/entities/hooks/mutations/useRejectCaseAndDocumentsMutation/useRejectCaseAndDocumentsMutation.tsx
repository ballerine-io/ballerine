import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { fetchWorkflowEventDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';
import { updateDocumentsDecisionByIds } from '@/domains/documents/fetchers';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';

export const useRejectCaseAndDocumentsMutation = ({
  workflowId,
  rejectionReason,
  ids,
  isDocumentsV2,
}: {
  workflowId: string;
  rejectionReason: string;
  ids: string[];
  isDocumentsV2: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (isDocumentsV2) {
        await updateDocumentsDecisionByIds({
          ids,
          data: {
            decision: Action.REJECT,
          },
        });
      }

      return fetchWorkflowEventDecision({
        workflowId,
        body: {
          name: Action.REJECT,
          reason: rejectionReason,
        },
      });
    },
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:reject_case.success'));
    },
    onError: () => {
      toast.error(t('toast:reject_case.error'));
    },
  });
};
