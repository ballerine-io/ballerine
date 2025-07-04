import get from 'lodash/get';
import { IDocumentFieldParams } from '../../../../DocumentField';
import { composePathToDocumentPageProperty } from '../compose-path-to-document-page-property';
import { GetUIElementByType } from '@ballerine/common';

export const getFileOrFileIdFromDocumentsList = (
  documentsList: Array<IDocumentFieldParams['template']> = [],
  element: GetUIElementByType<'documentfield'>,
): File | string | undefined => {
  const { pageIndex = 0, pageProperty = 'ballerineFileId', template } = element.params || {};

  // TODO: fix template id
  // @ts-expect-error
  const documentIndex = documentsList?.findIndex(document => document.id === template?.id);

  if (documentIndex === -1) {
    return undefined;
  }

  const filePath = composePathToDocumentPageProperty(documentIndex, pageProperty, pageIndex);
  const fileOrFileId = get(documentsList, filePath, undefined);

  return fileOrFileId;
};
