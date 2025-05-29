import { useHttpClient } from '@/components/organisms/Form/DynamicForm/providers/HttpClientProvider';
import { useCallback } from 'react';
import { IDocumentWithFiles } from '../../../../types';
import { queryClient } from '@/components/organisms/Form/DynamicForm/utils/query-client';
import { documentsQueryKeys } from '../../documents.query-keys';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useReuploadDocumentMutation = () => {
  const httpClient = useHttpClient();

  const reuploadDocument = useCallback(
    async ({ documentId, documentFile }: { documentId: string; documentFile: File }) => {
      const formData = new FormData();

      formData.append('file', documentFile);

      const request = await httpClient.post<IDocumentWithFiles>(
        `/collection-flow/documents/${documentId}/reupload`,
        formData,
      );

      return request.data;
    },
    [httpClient],
  );

  return useMutation({
    mutationFn: reuploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.list().queryKey });
    },
    onError: error => {
      console.error('Failed to reupload document', error);
      toast.error('Failed to reupload document. Please try again.');
    },
  });
};
