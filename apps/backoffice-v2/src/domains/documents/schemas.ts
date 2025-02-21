import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { z } from 'zod';

export const EndUserSchema = ObjectWithIdSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
});

export const EntityType = {
  BUSINESS: 'business',
  UBO: 'ubo',
  DIRECTOR: 'director',
} as const;

export const DocumentTrackerItemSchema = z.object({
  documentId: z.string().nullable(),
  status: z.enum(['provided', 'unprovided', 'requested']),
  decision: z.string().nullable(),
  identifiers: z.object({
    document: z.object({
      type: z.string(),
      templateId: z.string(),
      category: z.string(),
      issuingCountry: z.string(),
      decisionReason: z.string().optional(),
      issuingVersion: z.string(),
      version: z.string(),
    }),
    entity: z.discriminatedUnion('entityType', [
      ObjectWithIdSchema.extend({
        entityType: z.literal(EntityType.BUSINESS),
        companyName: z.string(),
      }),
      EndUserSchema.extend({
        entityType: z.literal(EntityType.UBO),
      }),
      EndUserSchema.extend({
        entityType: z.literal(EntityType.DIRECTOR),
      }),
    ]),
  }),
});

export type TDocumentsTrackerItem = z.infer<typeof DocumentsTrackerSchema>;

export const DocumentsTrackerSchema = z.object({
  business: z.array(DocumentTrackerItemSchema),
  individuals: z.object({
    ubos: z.array(DocumentTrackerItemSchema),
    directors: z.array(DocumentTrackerItemSchema),
  }),
});

export const RequestDocumentsSchema = z.object({
  workflowId: z.string(),
  documents: z.array(
    z.object({
      ...DocumentTrackerItemSchema.shape.identifiers.shape.document.shape,
      entity: z.object({
        id: z.string(),
        type: z.enum([EntityType.BUSINESS, EntityType.UBO, EntityType.DIRECTOR]),
      }),
    }),
  ),
});

export type RequestDocumentsInput = z.infer<typeof RequestDocumentsSchema>;
