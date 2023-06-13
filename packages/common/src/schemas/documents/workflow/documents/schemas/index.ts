import { ghanaDocuments } from './GH';
import { TDocument } from '../types';
import { countryCodes } from '@/countries';

const documentIdsByCountry: Partial<Record<(typeof countryCodes)[number], TDocument[]>> = {
  GH: ghanaDocuments,
};

export const getDocumentsByCountry = (countryCode: (typeof countryCodes)[number]): TDocument[] => {
  return documentIdsByCountry[countryCode] || [];
};
