import { TDocumentEntityType } from '@/components/organisms/Form/DocumentsService/types';
import { IFormElement } from '../../../../types';
import { IDocumentFieldParams } from '../..';
import { useDocument } from '@/components/organisms/Form/DocumentsService';
import { useReuploadDocumentMutation } from '@/components/organisms/Form/DocumentsService/domains/documents/mutations/useReuploadDocumentMutation';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface IUseReuploadDocumentParams {
  element: IFormElement<'documentfield', IDocumentFieldParams>;
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
      });
    },
    [document, mutateAsync],
  );

  return {
    reuploadDocument,
    isReuploadingDocument,
  };
};
