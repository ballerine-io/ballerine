import { DefaultContextSchema } from '@/workflow/schemas/context';
import { PartialDeep } from 'type-fest';
import { getDocumentId } from '@/workflow/utils';
import { merge } from 'lodash-es';

type Documents = DefaultContextSchema['documents'];
type Document = Documents[number];
type Pages = Document['pages'];

const toDocumentsMap = <T extends PartialDeep<Documents>>(documents: T) => {
  return documents.reduce((map, document) => {
    const documentId = getDocumentId(document as Document);

    map[documentId] = structuredClone(document);
    delete map[documentId]?.pages;

    return map;
  }, {} as Record<string, T[number]>);
};

const toDocumentPagesMap = (documents: Documents) => {
  return documents.reduce((documentPagesMap, document) => {
    const documentId = getDocumentId(document);

    documentPagesMap[documentId] = structuredClone(document.pages);

    return documentPagesMap;
  }, {} as Record<string, Pages>);
};

export function updateDocuments(
  documents: Documents,
  documentsToUpdate: PartialDeep<Documents>,
): Documents {
  const documentsMap = toDocumentsMap(documents);

  const documentsToUpdateMap = toDocumentsMap(documentsToUpdate as Documents);

  merge(documentsMap, documentsToUpdateMap);

  const updatedDocuments = Object.values(documentsMap);

  const pagesMap = toDocumentPagesMap(documents);
  const pagesToUpdateMap = toDocumentPagesMap(documentsToUpdate as Documents);

  updatedDocuments.forEach(document => {
    const documentId = getDocumentId(document);

    const oldPages = pagesMap[documentId] || [];
    const newPages = pagesToUpdateMap[documentId] || [];

    const doesntHaveChanges = !newPages.length;

    if (doesntHaveChanges) {
      document.pages = Object.values(oldPages);

      return;
    }

    const hasNewPages = newPages.some(page => !page.ballerineFileId);

    if (hasNewPages) {
      document.pages = newPages;

      return;
    }

    document.pages = [
      ...oldPages.map(oldPage => {
        const newPage = newPages.find(
          newPage => newPage.ballerineFileId === oldPage.ballerineFileId,
        );

        return newPage ? merge(oldPage, newPage) : oldPage;
      }),
      ...newPages.filter(newPage => !newPage.ballerineFileId),
    ];
  });

  return updatedDocuments;
}
