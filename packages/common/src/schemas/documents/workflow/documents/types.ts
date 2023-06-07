import { DefaultContextSchema } from '@/workflow/schemas/context';

export type TDocument = Omit<DefaultContextSchema['documents'][number], 'pages' | 'properties'> & {
  propertiesSchema: any;
};
