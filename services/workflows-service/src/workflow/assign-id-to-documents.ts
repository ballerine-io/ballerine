import { randomUUID } from 'crypto';
import {DefaultContextSchema} from "@ballerine/common";

type Documents = DefaultContextSchema['documents'];

export const assignIdToDocuments = (documents: Documents): Documents =>
  documents.map(document => {
    return {
      id: randomUUID(),
      ...document,
    };
  });
