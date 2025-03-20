import { TDocument } from '@ballerine/common';

export const isUboDocument = (uboDocuments: TDocument[], document: TDocument) =>
  uboDocuments.some(uboDocument => uboDocument.id === document.id);
