import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { fetchWorkflowEventDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';
import { updateDocumentsDecisionByIds } from '@/domains/documents/fetchers';

export const useRevisionCaseAndDocumentsMutation = ({
  isDocumentsV2,
}: {
  isDocumentsV2: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      revisionReason,
      ids,
      workflowId,
    }: {
      revisionReason: string;
      ids: string[];
      workflowId: string;
    }) => {
      if (isDocumentsV2) {
        await updateDocumentsDecisionByIds({
          ids,
          data: {
            decision: Action.REVISION,
          },
        });
      }

      return fetchWorkflowEventDecision({
        workflowId,
        body: {
          name: Action.REVISION,
          reason: revisionReason,
        },
      });
    },
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:ask_revision_case.success'));
    },
    onError: () => {
      toast.error(t('toast:ask_revision_case.error'));
    },
  });
};
