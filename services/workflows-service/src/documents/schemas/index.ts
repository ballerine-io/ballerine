import { getDocumentId } from '@/documents/utils';
import { ghanaDocuments } from './GH';
import { Document } from '../types';

const convertToDictonary = (documents: Document[]) =>
  documents.reduce<Record<string, Document>>(
    // @ts-ignore
    (document: Document, cur) => {
      const id = getDocumentId(document);
      // @ts-ignore
      cur[id] = document;
      return cur;
    },
    {} as Record<string, Document>,
  );

const documentKeysByCountry = {
  GH: convertToDictonary(ghanaDocuments),
};

const addUnkownDocumentType = (documents: Record<string, Document>) => ({
  ...documents,
});

export const getDocumentsByCountry = (country: string): Record<string, Document> => {
  let documents = documentKeysByCountry[country];
  if (!documents) return {};

  return addUnkownDocumentType(documents);
};
