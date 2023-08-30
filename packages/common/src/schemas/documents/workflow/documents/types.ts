import { DefaultContextSchema } from '@/schemas';
import { TSchema } from '@sinclair/typebox';
import { JSONSchema7 } from 'json-schema';

export type TDocument = Omit<DefaultContextSchema['documents'][number], 'pages' | 'properties'> & {
  propertiesSchema: JSONSchema7 | TSchema;
};
