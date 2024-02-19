import { DefaultContextSchema } from '@ballerine/common';
import z from 'zod';

export type TDocumentWithoutPageType = Omit<DefaultContextSchema['documents'][number], 'pages'> & {
  pages: Array<Omit<DefaultContextSchema['documents'][number]['pages'][number], 'type'>>;
};
export type TDocumentsWithoutPageType = TDocumentWithoutPageType[];

export const SubscriptionSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('webhook'),
      url: z.string().url(),
      events: z.array(z.string()),
    })
    .strict(),
]);
