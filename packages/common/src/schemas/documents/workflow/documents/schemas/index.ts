import { countryCodes } from '@/countries';
import { DefaultContextSchema } from '@/schemas';
import { getUgandaDocuments } from '@/schemas/documents/workflow/documents/schemas/UG';
import { TDocument } from '../types';
import { getCanadaDocuments } from './CA';
import { getGhanaDocuments } from './GH';
import { getUniversalDocuments } from './ZZ';

const documentIdsByCountry: Partial<Record<(typeof countryCodes)[number], () => TDocument[]>> = {
  GH: getGhanaDocuments,
  CA: getCanadaDocuments,
  UG: getUgandaDocuments,
  ZZ: getUniversalDocuments,
} as Partial<Record<(typeof countryCodes)[number] | 'ZZ', () => TDocument[]>>;

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

export const findDocumentSchemaByTypeAndCategory = (
  type: string,
  category: string,
): TDocument | null => {
  const documentGetters = Object.values(documentIdsByCountry);

  for (const getDocuments of documentGetters) {
    const documents = getDocuments();
    const document = documents.find(doc => doc.type === type && doc.category === category);

    if (!document) continue;

    return document;
  }

  return null;
};
