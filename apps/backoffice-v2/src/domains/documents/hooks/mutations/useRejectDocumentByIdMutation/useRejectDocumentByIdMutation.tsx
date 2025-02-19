import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { toast } from 'sonner';
import { Action } from '../../../../../common/enums';
import { updateDocumentDecisionById } from '@/domains/documents/fetchers';

export const useRejectDocumentByIdMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      decisionReason,
      comment,
    }: {
      documentId: string;
      decisionReason?: string;
      comment?: string;
    }) =>
      updateDocumentDecisionById({
        documentId,
        data: {
          decision: Action.REJECT,
          decisionReason,
          comment,
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries();

      toast.success(t('toast:reject_document.success'));
    },
    onError: (_error, _variables) => {
      toast.error(t('toast:reject_document.error', { errorMessage: _error.message }));
    },
  });
};
