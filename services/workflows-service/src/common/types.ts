import { DefaultContextSchema } from '@ballerine/common';
import z from 'zod';
import { Prisma } from '@prisma/client';

export type TDocumentWithoutPageType = Omit<DefaultContextSchema['documents'][number], 'pages'> & {
  pages: Array<Omit<DefaultContextSchema['documents'][number]['pages'][number], 'type'>>;
};

export type TDocumentsWithoutPageType = TDocumentWithoutPageType[];

const SECRET_TEMPLATE_URL_REGEX = /^\{secret\.[A-Za-z0-9_]+\}$/;

const SubscriptionUrlSchema = z.string().refine(value => {
  // Allow secret placeholders (resolved later in webhooks.service.ts)
  if (SECRET_TEMPLATE_URL_REGEX.test(value)) return true;

  // Match Zod's built-in url() semantics (WHATWG URL parsing)
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}, 'Invalid url');

export const SubscriptionSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.enum(['webhook', 'email']),
      url: SubscriptionUrlSchema,
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
