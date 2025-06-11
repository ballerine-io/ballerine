import { TDocumentEntityType } from '@/components/organisms/Form/DocumentsService/types';
import { IDocumentFieldParams } from '../..';
import { IFormElement } from '../../../../types';
import {
  useCreateDocumentMutation,
  useDocument,
} from '@/components/organisms/Form/DocumentsService';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface IUseCreateDocumentParams {
  element: IFormElement<'documentfield', IDocumentFieldParams>;
  entityType: TDocumentEntityType;
  entityId: string;
}

export const useCreateDocument = ({ element, entityType, entityId }: IUseCreateDocumentParams) => {
  const document = useDocument({
    type: element.params?.template?.type!,
    category: element.params?.template?.category!,
    entityType,
    entityId,
  });

  const { mutateAsync, isPending: isCreatingDocument } = useCreateDocumentMutation();

  const createDocument = useCallback(
    async (file: File) => {
      if (document) {
        console.log('Document already exists', document);

        toast.error('Document creation aborted, already exists.');

        return;
      }

      await mutateAsync({
        documentFile: file,
        data: {
          issuingCountry: element.params?.template?.issuer.country!,
          issuingVersion: element.params?.template?.issuingVersion!,
          entityId,
          entityType,
          documentType: element.params?.documentType!,
          documentVariant: element.params?.documentVariant!,
          documentPage: Number(element.params?.pageIndex!) || 1,
          category: element.params?.template?.category!,
          type: element.params?.template?.type!,
        },
      });
    },
    [document, mutateAsync],
  );

  return {
    createDocument,
    isCreatingDocument,
  };
};
