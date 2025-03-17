import set from 'lodash/set';
import { IDocumentFieldParams } from '../../../..';
import { IFormElement } from '../../../../../../..';
import { composePathToDocumentPageProperty } from '../compose-path-to-document-page-property';

export interface TDocument {
  id: string;
  documentFile: {
    id: string;
    file: {
      id: string;
      mimeType: string;
      fileName: string;
    };
  };
}

export const createOrUpdateDocumentInList = (
  _documents: Array<IDocumentFieldParams['template']> = [],
  element: IFormElement<'documentfield', IDocumentFieldParams>,
  document: File | TDocument,
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
    const pathToFileId = composePathToDocumentPageProperty(
      documents.length - 1,
      'ballerineFileId',
      pageIndex,
    );
    const pathToMimeType = composePathToDocumentPageProperty(
      documents.length - 1,
      'type',
      pageIndex,
    );
    const pathToFileName = composePathToDocumentPageProperty(
      documents.length - 1,
      'fileName',
      pageIndex,
    );

    if (document instanceof File) {
      set(documents, pathToFileId, document);
    } else {
      set(documents, pathToFileId, document.documentFile.file.id);
      set(documents, pathToMimeType, document.documentFile.file.mimeType);
      set(documents, pathToFileName, document.documentFile.file.fileName);
      documents.at(0)!._document = document;
    }

    return documents;
  } else {
    const existingDocumentIndex = documents.findIndex(document => document.id === template?.id);
    documents[existingDocumentIndex] = { ...documents[existingDocumentIndex], ...template };
    const existingDocument = documents[existingDocumentIndex];
    const pathToFileId = composePathToDocumentPageProperty(
      existingDocumentIndex,
      pageProperty,
      pageIndex,
    );
    const pathToMimeType = composePathToDocumentPageProperty(
      existingDocumentIndex,
      'type',
      pageIndex,
    );
    const pathToFileName = composePathToDocumentPageProperty(
      existingDocumentIndex,
      'fileName',
      pageIndex,
    );

    if (document instanceof File) {
      set(documents, pathToFileId, document);
    } else {
      set(documents, pathToFileId, document.documentFile.file.id);
      set(documents, pathToMimeType, document.documentFile.file.mimeType);
      set(documents, pathToFileName, document.documentFile.file.fileName);
      existingDocument._document = document;
    }
  }

  return documents;
};
