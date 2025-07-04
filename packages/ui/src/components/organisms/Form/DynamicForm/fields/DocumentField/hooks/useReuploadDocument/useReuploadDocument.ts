import { TDocumentEntityType } from '@/components/organisms/Form/DocumentsService/types';
import { useDocument } from '@/components/organisms/Form/DocumentsService';
import { useReuploadDocumentMutation } from '@/components/organisms/Form/DocumentsService/domains/documents/mutations/useReuploadDocumentMutation';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { GetUIElementByType } from '@ballerine/common';

interface IUseReuploadDocumentParams {
  element: GetUIElementByType<'documentfield'>;
  entityType: TDocumentEntityType;
  entityId: string;
}

export const useReuploadDocument = ({
  element,
  entityType,
  entityId,
}: IUseReuploadDocumentParams) => {
  const document = useDocument({
    type: element.params?.template?.type!,
    category: element.params?.template?.category!,
    entityType,
    entityId,
  });

  const { mutateAsync, isPending: isReuploadingDocument } = useReuploadDocumentMutation();

  const reuploadDocument = useCallback(
    async (file: File) => {
      if (!document) {
        toast.error('Document not found, failed to reupload.');

        return;
      }

      await mutateAsync({
        documentFile: file,
        documentId: document.id,
        metadata: {
          documentType: element.params?.documentType!,
          documentVariant: element.params?.documentVariant!,
          pageIndex: element.params?.pageIndex! || 1,
        },
      });
    },
    [document, mutateAsync],
  );

  return {
    reuploadDocument,
    isReuploadingDocument,
  };
};
