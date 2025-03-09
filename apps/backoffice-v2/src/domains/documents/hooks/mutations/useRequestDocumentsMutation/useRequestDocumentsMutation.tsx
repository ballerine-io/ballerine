import { isObject } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { toast } from 'sonner';

import { HttpError } from '@/common/errors/http-error';
import { requestDocumentsUpload } from '@/domains/documents/fetchers';

export const useRequestDocumentsMutation = (options?: {
  onSuccess?: <TData>(data: TData) => void;
}) => {
  const { onSuccess } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestDocumentsUpload,
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:request_documents.success`));

      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(
        t(`toast:request_documents.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });
};
