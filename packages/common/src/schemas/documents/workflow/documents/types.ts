import { DefaultContextSchema } from '@/schemas';

export type TDocument = Omit<DefaultContextSchema['documents'][number], 'pages' | 'properties'> & {
  propertiesSchema: any;
};
