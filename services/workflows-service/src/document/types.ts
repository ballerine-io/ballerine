import { DocumentDecision, DocumentStatus } from '@prisma/client';
import { z } from 'zod';

const ParsedUIDocumentSchema = z.object({
  entityType: z.enum(['business', 'ubo', 'director']),
  type: z.string(),
  templateId: z.string(),
  category: z.string(),
  issuingCountry: z.string(),
  issuingVersion: z.string(),
  version: z.string(),
});

type TParsedDocument = z.infer<typeof ParsedUIDocumentSchema>;
export type TParsedDocumentWithEntityId = TParsedDocument & {
  ballerineEntityId: string;
};

export type TParsedDocuments = {
  business: TParsedDocument[];
  individuals: {
    ubos: TParsedDocumentWithEntityId[];
    directors: TParsedDocumentWithEntityId[];
  };
};

export const EntitySchema = z.discriminatedUnion('entityType', [
  z.object({
    entityType: z.literal('business'),
    id: z.string(),
    companyName: z.string(),
  }),
  z.object({
    entityType: z.literal('ubo'),
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  z.object({
    entityType: z.literal('director'),
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
]);

export const DocumentTrackerDocumentSchema = z.object({
  documentId: z.string().nullable(),
  status: z.nativeEnum({
    ...DocumentStatus,
    unprovided: 'unprovided',
  }),
  decision: z.nativeEnum(DocumentDecision).nullable(),
  identifiers: z.object({
    document: ParsedUIDocumentSchema.omit({ entityType: true }),
    entity: EntitySchema,
  }),
});

export const DocumentTrackerResponseSchema = z.object({
  business: z.array(DocumentTrackerDocumentSchema),
  individuals: z.object({
    ubos: z.array(DocumentTrackerDocumentSchema),
    directors: z.array(DocumentTrackerDocumentSchema),
  }),
});
