import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '../../../../../DynamicForm/providers/HttpClientProvider';
import { useCallback } from 'react';
import { IDocument } from '../../../../types';
import { documentsQueryKeys } from '../../documents.query-keys';

export const useDocumentsQuery = (excludeFiles = true) => {
  const httpClient = useHttpClient();

  const fetchDocuments = useCallback(async () => {
    const request = await httpClient.get<IDocument[]>('/collection-flow/documents');

    return request.data;
  }, [httpClient]);

  const query = useQuery({
    queryKey: documentsQueryKeys.list().queryKey,
    queryFn: fetchDocuments,
  });

  return {
    ...query,
    data: excludeFiles ? query.data?.map(document => ({ ...document, files: [] })) : query.data,
  };
};
