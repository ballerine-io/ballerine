import { getGhanaDocuments } from './GH';
import { TDocument } from '../types';
import { countryCodes } from '@/countries';
import { DefaultContextSchema } from '@/schemas';
import { getCanadaDocuments } from './CA';
import { getUgandaDocuments } from '@/schemas/documents/workflow/documents/schemas/UG';

const documentIdsByCountry: Partial<Record<(typeof countryCodes)[number], () => TDocument[]>> = {
  GH: getGhanaDocuments,
  CA: getCanadaDocuments,
  UG: getUgandaDocuments,
};

export const getDocumentsByCountry = (countryCode: (typeof countryCodes)[number]): TDocument[] => {
  return documentIdsByCountry[countryCode]?.() || [];
};

export const getDocumentId = (
  document: TDocument | DefaultContextSchema['documents'][number],
  useUuid = true,
) => {
  if (useUuid && document?.id) return document.id;

  let id = `${document?.category}-${document?.type}-${document?.issuer?.country}`;

  if (document.version) {
    id = `${id}-v${document.version}`;
  }

  return id.toLowerCase();
};
