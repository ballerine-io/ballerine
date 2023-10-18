import { assignIdToDocuments } from '@/workflow/assign-id-to-documents';
import { DefaultContextSchema } from '@ballerine/common';

type Documents = DefaultContextSchema['documents'];
type Document = Documents[number];

export const updateDocuments = (
  existingDocuments: Documents,
  documentsToUpdate: Documents,
): Documents => {
  const updatedDocumentsMap = new Map<string, Document>();

  if (!existingDocuments?.length && documentsToUpdate?.every(doc => !doc.id)) {
    documentsToUpdate = assignIdToDocuments(documentsToUpdate);
  }

  existingDocuments?.forEach(document => {
    if (!document) return;

    updatedDocumentsMap.set(document.id!, document);
  });

  documentsToUpdate?.forEach(document => {
    updatedDocumentsMap.set(document.id!, document);
  });

  return Array.from(updatedDocumentsMap.values());
};
