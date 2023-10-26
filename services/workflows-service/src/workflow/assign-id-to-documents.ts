import { randomUUID } from 'crypto';
import { DefaultContextSchema } from '@ballerine/common';

export type TDocuments = DefaultContextSchema['documents'];

export const assignIdToDocuments = (documents: TDocuments): TDocuments =>
  documents?.map(document => {
    return {
      ...document,
      id: document.id ?? randomUUID(),
    };
  });
