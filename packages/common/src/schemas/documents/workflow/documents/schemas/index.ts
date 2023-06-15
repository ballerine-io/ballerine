import { ghanaDocuments } from './GH';
import { TDocument } from '../types';
import { countryCodes } from '@/countries';
import { DefaultContextSchema } from '@/schemas';

const documentIdsByCountry: Partial<Record<(typeof countryCodes)[number], TDocument[]>> = {
  GH: ghanaDocuments,
};

export const getDocumentsByCountry = (countryCode: (typeof countryCodes)[number]): TDocument[] => {
  return documentIdsByCountry[countryCode] || [];
};

export const getDocumentId = (
  document: TDocument | DefaultContextSchema['documents'][number],
  useUuid = true,
): string => {
  if (useUuid && document?.id) return document?.id;

  let id = `${document?.category}-${document?.type}-${document?.issuer?.country}`;

  if (document.version) {
    id = `${id}-v${document.version}`;
  }

  return id.toLowerCase();
};
