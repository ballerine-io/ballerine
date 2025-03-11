import { AnyObject } from '@/common';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import get from 'lodash/get';
import { IFormElement } from '../../../types';
import { IDocumentFieldParams } from '../DocumentField';
import { IDocumentState } from '../hooks/useDocumentState';
import { getDocumentObjectFromDocumentsList } from '../hooks/useDocumentUpload/helpers/get-document-object-from-documents-list';
import { getFileOrFileIdFromDocumentsList } from '../hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';

export const buildDocumentFieldThisState = (
  context: AnyObject,
  _metadata: AnyObject,
  stack: TDeepthLevelStack,
) => {
  const metadata = _metadata as unknown as {
    element: IFormElement<'documentfield', IDocumentFieldParams>;
  };
  const documentsDestination = formatValueDestination(metadata.element.valueDestination, stack);
  const documents = get(context, documentsDestination);
  const fileOrFileId = getFileOrFileIdFromDocumentsList(documents, metadata.element);

  const elementContext: IDocumentState = {
    document: getDocumentObjectFromDocumentsList(documents, metadata.element),
    fileId: typeof fileOrFileId === 'string' ? fileOrFileId : undefined,
    element: metadata.element,
  };

  return { $this: elementContext };
};
