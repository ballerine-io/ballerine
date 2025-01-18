import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import get from 'lodash/get';
import { IDocumentFieldParams } from '../../../../DocumentField';
import { composePathToFileId } from '../compose-path-to-file-id';

export const getFileOrFileIdFromDocumentsList = (
  documentsList: Array<IDocumentFieldParams['template']> = [],
  element: IFormElement<'documentfield', IDocumentFieldParams>,
): File | string | undefined => {
  const { pageIndex = 0, pageProperty = 'ballerineFileId', template } = element.params || {};

  const documentIndex = documentsList?.findIndex(document => document.id === template?.id);

  if (documentIndex === -1) return undefined;

  const filePath = composePathToFileId(documentIndex, pageProperty, pageIndex);
  const fileOrFileId = get(documentsList, filePath, undefined);

  return fileOrFileId;
};
