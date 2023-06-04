import { getDocumentId } from '@/documents/utils';
import { ghanaDocuments } from './GH';
import { Document } from '../types';
import { countryCodes } from '@/common/countries';

const createDocumentIdToDocumentMap = (documents: Document[]) => {
  const result = {} as Record<string, Document>;
  for (const document of documents) {
    const id = getDocumentId(document);
    result[id] = document;
  }
  return result;
};

const documentIdsByCountry: Partial<Record<(typeof countryCodes)[number], any>> = {
  GH: createDocumentIdToDocumentMap(ghanaDocuments),
};

export const getDocumentsByCountry = (
  countryCode: (typeof countryCodes)[number],
): Record<string, Document> => {
  const documents = documentIdsByCountry[countryCode];
  if (!documents) return {};

  return documents;
};
