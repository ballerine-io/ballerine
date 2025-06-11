import { useHttpClient } from '@/components/organisms/Form/DynamicForm/providers/HttpClientProvider';
import { useCallback } from 'react';
import { IDocumentWithFiles } from '../../../../types';
import { documentsQueryKeys } from '../../documents.query-keys';
import { useQuery } from '@tanstack/react-query';

export const useDocumentWithFilesQuery = (documentId: string | undefined) => {
  const httpClient = useHttpClient();

  const fetchDocumentWithFiles = useCallback(async () => {
    if (!documentId) {
      return null;
    }

    const request = await httpClient.get<IDocumentWithFiles>(
      `/collection-flow/documents/${documentId}`,
    );

    return request.data;
  }, [documentId, httpClient]);

  return useQuery({
    queryKey: documentsQueryKeys.item(documentId!).queryKey,
    queryFn: fetchDocumentWithFiles,
    enabled: !!documentId,
  });
};
