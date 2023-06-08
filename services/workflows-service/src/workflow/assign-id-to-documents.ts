import { DefaultContextSchema } from '@/workflow/schemas/context';
import { randomUUID } from 'crypto';

type Documents = DefaultContextSchema['documents'];

export const assignIdToDocuments = (documents: Documents): Documents =>
  documents.map(document => {
    return {
      id: randomUUID(),
      ...document,
    };
  });
