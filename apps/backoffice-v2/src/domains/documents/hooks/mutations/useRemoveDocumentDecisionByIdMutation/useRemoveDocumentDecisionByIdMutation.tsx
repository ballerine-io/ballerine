import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { toast } from 'sonner';
import { updateDocumentDecisionById } from '@/domains/documents/fetchers';

export const useRemoveDocumentDecisionByIdMutation = () => {
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
          decision: null,
          decisionReason,
          comment,
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries();

      toast.success(t('toast:revert_revision.success'));
    },
    onError: (_error, _variables) => {
      toast.error(t('toast:revert_revision.error', { errorMessage: _error.message }));
    },
  });
};
