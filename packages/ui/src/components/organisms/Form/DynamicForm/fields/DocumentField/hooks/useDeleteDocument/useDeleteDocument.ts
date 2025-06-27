import { useDeleteDocumentFilesMutation } from '@/components/organisms/Form/DocumentsService';
import { useCallback } from 'react';

export const useDeleteDocumentFiles = () => {
  const { mutateAsync, isPending: isDeletingDocumentFiles } = useDeleteDocumentFilesMutation();

  const deleteDocumentFiles = useCallback(
    async (documentId: string) => {
      if (!documentId || typeof documentId !== 'string') {
        throw new Error('Document ID is required');
      }

      await mutateAsync(documentId);
    },
    [mutateAsync],
  );

  return {
    deleteDocumentFiles,
    isDeletingDocumentFiles,
  };
};
