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
    async ({
      documentId,
      documentFile,
      metadata,
    }: {
      documentId: string;
      documentFile: File;
      metadata: {
        documentType: string;
        documentVariant: string;
        pageIndex: number;
      };
    }) => {
      const formData = new FormData();

      formData.append('file', documentFile);
      formData.append('documentType', metadata.documentType);
      formData.append('documentVariant', metadata.documentVariant);
      formData.append('page', metadata.pageIndex.toString());

      const request = await httpClient.put<IDocumentWithFiles>(
        `/collection-flow/documents/${documentId}`,
        formData,
      );

      return request.data;
    },
    [httpClient],
  );

  return useMutation({
    mutationFn: reuploadDocument,
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.list().queryKey });
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.item(documentId).queryKey });
    },
    onError: error => {
      console.error('Failed to reupload document', error);
      toast.error('Failed to reupload document. Please try again.');
    },
  });
};
