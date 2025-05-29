import { useDeleteDocumentMutation } from '@/components/organisms/Form/DocumentsService';
import { useCallback } from 'react';

export const useDeleteDocument = () => {
  const { mutateAsync, isPending: isDeletingDocument } = useDeleteDocumentMutation();

  const deleteDocument = useCallback(
    async (documentId: string) => {
      await mutateAsync(documentId);
    },
    [mutateAsync],
  );

  return {
    deleteDocument,
    isDeletingDocument,
  };
};
