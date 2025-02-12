import { z } from 'zod';

export type TrackedDocument = z.infer<typeof DocumentTrackerItemSchema>;
export const DocumentTrackerItemSchema = z.object({
  documentId: z.string().nullable(),
  status: z.enum(['provided', 'unprovided', 'requested']),
  decision: z.string().nullable(),
  properties: z.object({
    type: z.string(),
    templateId: z.string(),
    category: z.string(),
    issuingCountry: z.string(),
    issuingVersion: z.string(),
    version: z.string(),
  }),
  entity: z.object({
    entityType: z.string(),
    id: z.string(),
    companyName: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

export type DocumentsTrackerData = z.infer<typeof DocumentsTrackerSchema>;
export const DocumentsTrackerSchema = z.object({
  business: z.array(DocumentTrackerItemSchema),
  individuals: z.object({
    ubos: z.array(DocumentTrackerItemSchema),
    directors: z.array(DocumentTrackerItemSchema),
  }),
});
