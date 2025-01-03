import { AnyObject, IFormElement } from '@ballerine/ui';
import get from 'lodash/get';

export interface IBuildPathToDocumentFileIdParams {
  rootPath: string;
  documentIndex: number;
  page: number;
  pageProperty: string;
}

export const buildPathToDocumentFileId = ({
  rootPath,
  documentIndex,
  page,
  pageProperty,
}: IBuildPathToDocumentFileIdParams) => {
  return `${rootPath}[${documentIndex}].pages[${page}].${pageProperty}`;
};

export interface IFormatFileFieldElementParams {
  path: string;
}

export const formatFileFieldElement = (
  element: IFormElement,
  { path }: IFormatFileFieldElementParams,
) => {
  const elementClone = structuredClone(element);

  elementClone.valueDestination = path;

  return elementClone;
};

export const getDocumentIndex = (path: string, context: AnyObject, documentId: string) => {
  const documents = get(context, path, []);

  if (!documents.length) return 0;

  const documentIndex = documents.findIndex(
    (document: { id: string }) => document.id === documentId,
  );

  return documentIndex === -1 ? documents.length : documentIndex;
};

export const getDocumentIndexByDocumentId = (
  path: string,
  context: AnyObject,
  documentId: string,
) => {
  const documents = get(context, path, []);

  if (!documents.length) return 0;

  const documentIndex = documents.findIndex(
    (document: { id: string }) => document.id === documentId,
  );

  return documentIndex === -1 ? 0 : documentIndex;
};
