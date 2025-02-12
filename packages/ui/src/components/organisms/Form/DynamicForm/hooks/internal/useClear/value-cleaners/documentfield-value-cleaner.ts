import { AnyObject } from '@/common';
import { request } from '@/common/hooks/useHttp';
import { toast } from 'sonner';
import { IDocumentFieldParams, IDocumentTemplate } from '../../../../fields';
import { getFileOrFileIdFromDocumentsList } from '../../../../fields/DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { IFormElement, TBaseFields } from '../../../../types';

export const DOCUMENT_FIELD_VALUE_CLEANER = 'documentfield';

export const documentFieldValueCleaner = async <TValue extends Array<{ id: string }>>(
  value: TValue,
  element: IFormElement<TBaseFields, IDocumentFieldParams>,
  metadata?: AnyObject,
): Promise<TValue | undefined> => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  if (element.params?.httpParams?.deleteDocument) {
    const fileOrFileId = getFileOrFileIdFromDocumentsList(
      value as unknown as IDocumentTemplate[],
      element as IFormElement<'documentfield', IDocumentFieldParams>,
    );

    if (!(fileOrFileId instanceof File)) {
      try {
        await request(element.params?.httpParams?.deleteDocument, metadata);
      } catch (error) {
        toast.error(`Failed to delete document on hide. ${(error as Error)?.message}`);
      }
    }
  }

  return value.filter(({ id }) => id !== element.params?.template?.id) as TValue;
};
