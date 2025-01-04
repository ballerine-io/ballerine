import { DefaultContextSchema } from '@ballerine/common';
import z from 'zod';
import { Prisma } from '@prisma/client';

export type TDocumentWithoutPageType = Omit<DefaultContextSchema['documents'][number], 'pages'> & {
  pages: Array<Omit<DefaultContextSchema['documents'][number]['pages'][number], 'type'>>;
};

export type TDocumentsWithoutPageType = TDocumentWithoutPageType[];

export const SubscriptionSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.enum(['webhook', 'email']),
      url: z.string().url(),
      events: z.array(z.string()),
      config: z
        .object({
          withChildWorkflows: z.boolean().optional(),
        })
        .optional(),
    })
    .strict(),
]);

type SortableProperties<T> = {
  [K in keyof T]: T[K] extends Prisma.SortOrder | Prisma.SortOrderInput | undefined ? K : never;
}[keyof T];

export type SortableByModel<T> = Array<Exclude<SortableProperties<T>, undefined>>;
