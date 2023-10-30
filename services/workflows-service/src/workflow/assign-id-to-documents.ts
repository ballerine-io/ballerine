import { randomUUID } from 'crypto';
import { DefaultContextSchema } from '@ballerine/common';

export type TDocuments = DefaultContextSchema['documents'];

export const assignIdToDocuments = (documents: TDocuments): TDocuments =>
  documents?.map(document => {
    const documentWithId = {
      ...document,
      id: document.id || randomUUID(),
    };

    if (!documentWithId?.id) {
      console.error('Failed to assign an ID to a document\n', documentWithId);
    }

    return documentWithId;
  });
