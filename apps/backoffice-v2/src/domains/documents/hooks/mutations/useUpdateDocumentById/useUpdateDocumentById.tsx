import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { toast } from 'sonner';
import { updateDocumentById } from '@/domains/documents/fetchers';

export const useUpdateDocumentByIdMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, data }: Parameters<typeof updateDocumentById>[0]) =>
      updateDocumentById({
        documentId,
        data,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries();

      toast.success(t('toast:update_document_properties.success'));
    },
    onError: (_error, _variables) => {
      toast.error(t('toast:update_document_properties.error', { errorMessage: _error.message }));
    },
  });
};
