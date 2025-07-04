import { AnyObject } from '@/common';
import { IHttpParams, request } from '@/common/hooks/useHttp';
import { toast } from 'sonner';
import {
  getDocumentObjectFromDocumentsList, IDocumentTemplate
} from '../../../../fields';
import { getFileOrFileIdFromDocumentsList } from '../../../../fields/DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { DEFAULT_DELETION_PARAMS } from '../../../../fields/DocumentField/defaults';
import { GetUIElementByType, TUIElement } from '@ballerine/common';

export const DOCUMENT_FIELD_VALUE_CLEANER = 'documentfield';

export const documentFieldValueCleaner = async <TValue extends Array<{ id: string }>>(
  value: TValue,
  _element: TUIElement ,
  httpParams?: IHttpParams,
  metadata?: AnyObject,
): Promise<TValue | undefined> => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const documentFieldElement = _element as GetUIElementByType<'documentfield'>;
  const defaultHttpParams = documentFieldElement.params?.httpParams?.deleteDocument || DEFAULT_DELETION_PARAMS;

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
    documentFieldElement,
  );

  const fileOrFileId = getFileOrFileIdFromDocumentsList(
    value as unknown as IDocumentTemplate[],
    documentFieldElement,
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

  // TODO: Fix cleanup
  return value.filter(({ id }) => id !== (documentFieldElement.params?.template as any)?.id) as TValue;
};
