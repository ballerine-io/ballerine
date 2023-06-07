import { DefaultContextSchema } from '../../context';

export type TDocument = Omit<DefaultContextSchema['documents'][number], 'pages' | 'properties'> & {
  propertiesSchema: any;
};
