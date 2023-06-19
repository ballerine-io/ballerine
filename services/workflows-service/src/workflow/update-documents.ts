import { DefaultContextSchema } from '@ballerine/common';

type Documents = DefaultContextSchema['documents'];
type Document = Documents[number];

export const updateDocuments = (
  existingDocuments: Documents,
  documentsToUpdate: Documents,
): Documents => {
  const updatedDocumentsMap = new Map<string, Document>();

  // @ts-ignore
  existingDocuments?.forEach(document => {
    updatedDocumentsMap.set(document.id!, document);
  });

  // @ts-ignore
  documentsToUpdate?.forEach(document => {
    updatedDocumentsMap.set(document.id!, document);
  });

  return Array.from(updatedDocumentsMap.values());
};
