import { DefaultContextSchema } from '@/workflow/schemas/context';

export type Document = Omit<DefaultContextSchema['documents'][number], 'pages' | 'properties'> & {
  propertiesSchema: any;
};
