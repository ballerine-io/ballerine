import { DefaultContextSchema } from '@/schemas';
import { JSONSchema7 } from 'json-schema';

export type TDocument = Omit<DefaultContextSchema['documents'][number], 'pages' | 'properties'> & {
  propertiesSchema: JSONSchema7;
};

export type TDocumentsWithAvailability = {
  availableDocuments: Array<{ category: string; type: string }>;
  schema: TDocument[];
};
