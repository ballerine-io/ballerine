import { TDocument } from '@ballerine/common';

export const isBusinessDocument = (businessDocuments: TDocument[], document: TDocument) =>
  businessDocuments.some(businessDocument => businessDocument.id === document.id);
