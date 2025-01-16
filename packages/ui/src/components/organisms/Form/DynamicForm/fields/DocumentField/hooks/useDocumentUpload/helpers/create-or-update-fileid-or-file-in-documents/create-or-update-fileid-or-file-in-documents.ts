import set from 'lodash/set';
import { IDocumentFieldParams } from '../../../..';
import { IFormElement } from '../../../../../../..';
import { composePathToFileId } from '../compose-path-to-file-id';

export const createOrUpdateFileIdOrFileInDocuments = (
  _documents: Array<IDocumentFieldParams['template']> = [],
  element: IFormElement<'documentfield', IDocumentFieldParams>,
  fileIdOrFile: File | string,
) => {
  const documents = structuredClone(_documents || []);

  const { pageIndex = 0, pageProperty = 'ballerineFileId', template } = element.params || {};

  if (!template) {
    console.error('Document template is missing on element', element);

    return _documents;
  }

  const documentInListIndex = documents?.findIndex(document => document.id === template?.id);

  if (documentInListIndex === -1) {
    documents.push(structuredClone(template));
    const pathToFileId = composePathToFileId(documents.length - 1, pageProperty, pageIndex);
    set(documents, pathToFileId, fileIdOrFile);

    return documents;
  } else {
    const existingDocumentIndex = documents.findIndex(document => document.id === template?.id);
    const pathToFileId = composePathToFileId(existingDocumentIndex, pageProperty, pageIndex);

    set(documents, pathToFileId, fileIdOrFile);
  }

  return documents;
};
