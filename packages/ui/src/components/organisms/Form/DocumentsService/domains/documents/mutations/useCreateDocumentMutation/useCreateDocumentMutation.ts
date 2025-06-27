import { useHttpClient } from '@/components/organisms/Form/DynamicForm/providers/HttpClientProvider';
import { useCallback } from 'react';
import { IDocumentCreationData, IDocumentWithFiles } from '../../../../types';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/components/organisms/Form/DynamicForm/utils/query-client';
import { documentsQueryKeys } from '../../documents.query-keys';
import { toast } from 'sonner';

const createFormData = (data: IDocumentCreationData, documentFile: File) => {
  const formData = new FormData();

  formData.append('file', documentFile);

  formData.append('category', data.category);
  formData.append('type', data.type);
  formData.append('issuingVersion', data.issuingVersion.toString());
  formData.append('issuingCountry', data.issuingCountry);
  formData.append('documentType', data.documentType);
  formData.append('documentVariant', data.documentVariant);
  formData.append('page', data.documentPage.toString());

  if (data.entityType === 'business') {
    formData.append('businessId', data.entityId);
  } else {
    formData.append('endUserId', data.entityId);
  }

  return formData;
};

export const useCreateDocumentMutation = () => {
  const httpClient = useHttpClient();

  const createDocument = useCallback(
    async ({ data, documentFile }: { data: IDocumentCreationData; documentFile: File }) => {
      const formData = createFormData(data, documentFile);

      const request = await httpClient.post<IDocumentWithFiles>(
        '/collection-flow/documents',
        formData,
      );

      return request.data;
    },
    [httpClient],
  );

  return useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.list().queryKey });
    },
    onError: error => {
      console.error('Failed to create document', error);
      toast.error('Failed to create document. Please try again.');
    },
  });
};
