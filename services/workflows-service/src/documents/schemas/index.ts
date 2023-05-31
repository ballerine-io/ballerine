import { getDocumentId } from '@/documents/utils';
import { ghanaDocuments } from './GH';
import { Document } from '../types';
import { countryCodes } from '@/common/countries';

const convertToDictonary = (documents: Document[]) =>
  documents.reduce<Record<string, Document>>(
    // @ts-ignore
    (curr, document: Document) => {
      const id = getDocumentId(document);
      // @ts-ignore
      curr[id] = document;

      return curr;
    },
    {} as Record<string, Document>,
  );

const documentKeysByCountry: Partial<Record<(typeof countryCodes)[number], any>> = {
  GH: convertToDictonary(ghanaDocuments),
};

export const getDocumentsByCountry = (
  countryCode: (typeof countryCodes)[number],
): Record<string, Document> => {
  const documents = documentKeysByCountry[countryCode];
  if (!documents) return {};

  return documents;
};
