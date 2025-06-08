import { z } from 'zod';
import { FileFieldParamsSchema } from './filefield';

export const DOCUMENT_FIELD_ELEMENT_TYPE = 'documentfield' as const;
export const DocumentFieldElementType = z.literal(DOCUMENT_FIELD_ELEMENT_TYPE);

export const DocumentFieldParamsTemplate = z.object({
  category: z.string(),
  type: z.string(),
  issuer: z.object({
    country: z.string(),
  }),
  version: z.number(),
  issuingVersion: z.number(),
  properties: z.record(z.string(), z.any()),
});

export type TDocumentFieldParamsTemplate = z.infer<typeof DocumentFieldParamsTemplate>;

export const DocumentFieldParamsSchema = FileFieldParamsSchema.extend({
  template: DocumentFieldParamsTemplate,
  documentType: z.string(),
  documentVariant: z.string(),
  pageIndex: z.number().optional(),
  pageProperty: z.string().optional(),
  httpParams: FileFieldParamsSchema.shape.httpParams.optional(),
});

export type TDocumentFieldParams = z.infer<typeof DocumentFieldParamsSchema>;
