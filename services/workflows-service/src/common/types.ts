import { DefaultContextSchema } from '@ballerine/common';

export type TDocumentWithoutPageType = Omit<DefaultContextSchema['documents'][number], 'pages'> & {
  pages: Array<Omit<DefaultContextSchema['documents'][number]['pages'][number], 'type'>>;
};
export type TDocumentsWithoutPageType = TDocumentWithoutPageType[];
