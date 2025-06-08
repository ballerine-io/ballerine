import { useMutation } from '@tanstack/react-query';
import { useHttpClient } from '@/components/organisms/Form/DynamicForm/providers/HttpClientProvider';
import { useCallback } from 'react';
import { queryClient } from '@/components/organisms/Form/DynamicForm/utils/query-client';
import { documentsQueryKeys } from '../../documents.query-keys';
import { toast } from 'sonner';

export const useDeleteDocumentFilesMutation = () => {
  const httpClient = useHttpClient();

  const deleteDocument = useCallback(
    async (documentId: string) => {
      const request = await httpClient.delete(`/collection-flow/documents/${documentId}/files`);
      return request.data;
    },
    [httpClient],
  );

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.list().queryKey });
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.item(documentId).queryKey });
    },
    onError: error => {
      console.error('Failed to delete document', error);
      toast.error('Failed to delete document. Please try again.');
    },
  });
};
