import { DefaultContextSchema, getDocumentId } from '@ballerine/common';

type Documents = DefaultContextSchema['documents'];
type Document = Documents[number];

export const updateDocuments = (
  existingDocuments: Documents,
  documentsToUpdate: Documents,
): Documents => {
  const updatedDocumentsMap = new Map<string, Document>();

  // @ts-ignore
  existingDocuments.forEach(document => {
    const documentId = document.id || getDocumentId(document);

    updatedDocumentsMap.set(documentId, document);
  });

  // @ts-ignore
  documentsToUpdate.forEach(document => {
    const documentId = document.id || getDocumentId(document);

    updatedDocumentsMap.set(documentId, document);
  });

  return Array.from(updatedDocumentsMap.values());
};
