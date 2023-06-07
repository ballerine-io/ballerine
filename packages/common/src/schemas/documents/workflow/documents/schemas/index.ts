import { ghanaDocuments } from './GH';
import { TDocument } from '../types';
import { countryCodes } from '@/common/countries';
import { getDocumentId } from '@/schemas/documents/workflow/documents/utils';

const createDocumentIdToDocumentMap = (documents: TDocument[]) => {
  const result = {} as Record<string, TDocument>;
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
): Record<string, TDocument> => {
  const documents = documentIdsByCountry[countryCode];
  if (!documents) return {};

  return documents;
};
