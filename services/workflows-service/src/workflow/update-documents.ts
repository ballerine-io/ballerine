import { DefaultContextSchema } from '@/workflow/schemas/context';
import { getDocumentId } from '@/documents/utils';

type Documents = DefaultContextSchema['documents'];
type Document = Documents[number];

export const updateDocuments = (
  existingDocuments: Documents,
  documentsToUpdate: Documents,
): Documents => {
  const updatedDocumentsMap = new Map<string, Document>();

  existingDocuments?.forEach(document => {
    const documentId = getDocumentId(document);

    updatedDocumentsMap.set(documentId, document);
  });

  documentsToUpdate?.forEach(document => {
    const documentId = getDocumentId(document);

    updatedDocumentsMap.set(documentId, document);
  });

  return Array.from(updatedDocumentsMap.values());
};
