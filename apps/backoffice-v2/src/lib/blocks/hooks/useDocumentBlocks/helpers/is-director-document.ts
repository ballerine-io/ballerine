import { TDocument } from '@ballerine/common';

export const isDirectorDocument = (directorDocuments: TDocument[], document: TDocument) =>
  directorDocuments.some(directorDocument => directorDocument.id === document.id);
