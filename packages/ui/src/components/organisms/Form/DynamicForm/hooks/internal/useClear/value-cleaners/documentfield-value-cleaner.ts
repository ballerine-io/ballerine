import { AnyObject } from '@/common';
import { IHttpParams, request } from '@/common/hooks/useHttp';
import { toast } from 'sonner';
import {
  getDocumentObjectFromDocumentsList,
  IDocumentFieldParams,
  IDocumentTemplate,
} from '../../../../fields';
import { getFileOrFileIdFromDocumentsList } from '../../../../fields/DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { IFormElement, TBaseFields } from '../../../../types';
import { DEFAULT_DELETION_PARAMS } from '../../../../fields/DocumentField/defaults';

export const DOCUMENT_FIELD_VALUE_CLEANER = 'documentfield';

export const documentFieldValueCleaner = async <TValue extends Array<{ id: string }>>(
  value: TValue,
  element: IFormElement<TBaseFields, IDocumentFieldParams>,
  httpParams?: IHttpParams,
  metadata?: AnyObject,
): Promise<TValue | undefined> => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const defaultHttpParams = element.params?.httpParams?.deleteDocument || DEFAULT_DELETION_PARAMS;

  const mergedHttpParams = {
    ...defaultHttpParams,
    params: {
      ...httpParams?.params,
    },
    headers: {
      ...defaultHttpParams.headers,
      ...httpParams?.headers,
    },
  };

  const document = getDocumentObjectFromDocumentsList(
    value as unknown as IDocumentTemplate[],
    element as IFormElement<'documentfield', IDocumentFieldParams>,
  );

  const fileOrFileId = getFileOrFileIdFromDocumentsList(
    value as unknown as IDocumentTemplate[],
    element as IFormElement<'documentfield', IDocumentFieldParams>,
  );

  if (!(fileOrFileId instanceof File) && document?._document?.id) {
    try {
      await request(mergedHttpParams, metadata, {
        ids: [document?._document?.id],
      });
    } catch (error) {
      toast.error(`Failed to delete document on hide. ${(error as Error)?.message}`);
    }
  }

  return value.filter(({ id }) => id !== element.params?.template?.id) as TValue;
};
