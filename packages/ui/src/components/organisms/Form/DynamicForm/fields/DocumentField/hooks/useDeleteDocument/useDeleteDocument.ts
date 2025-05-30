import { useDeleteDocumentFilesMutation } from '@/components/organisms/Form/DocumentsService';
import { useCallback } from 'react';

export const useDeleteDocumentFiles = () => {
  const { mutateAsync, isPending: isDeletingDocumentFiles } = useDeleteDocumentFilesMutation();

  const deleteDocumentFiles = useCallback(
    async (documentId: string) => {
      await mutateAsync(documentId);
    },
    [mutateAsync],
  );

  return {
    deleteDocumentFiles,
    isDeletingDocumentFiles,
  };
};
