import { useMutation } from '@tanstack/react-query';
import { useHttpClient } from '@/components/organisms/Form/DynamicForm/providers/HttpClientProvider';
import { useCallback } from 'react';
import { queryClient } from '@/components/organisms/Form/DynamicForm/utils/query-client';
import { documentsQueryKeys } from '../../documents.query-keys';
import { toast } from 'sonner';

export const useDeleteDocumentMutation = () => {
  const httpClient = useHttpClient();

  const deleteDocument = useCallback(
    async (documentId: string) => {
      const request = await httpClient.delete(`/collection-flow/documents/${documentId}`);
      return request.data;
    },
    [httpClient],
  );

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.list().queryKey });
    },
    onError: error => {
      console.error('Failed to delete document', error);
      toast.error('Failed to delete document. Please try again.');
    },
  });
};
