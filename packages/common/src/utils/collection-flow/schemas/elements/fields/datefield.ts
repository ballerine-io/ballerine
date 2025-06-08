import { z } from 'zod';
import { FieldSchema } from '../common/field';

export const DateFieldParamsSchema = FieldSchema.extend({
  disableFuture: z.boolean().optional().default(false),
  disablePast: z.boolean().optional().default(false),
  outputFormat: z.string().optional(),
  inputFormat: z.string().optional(),
});

export type TDateFieldParams = z.infer<typeof DateFieldParamsSchema>;

export const DATE_FIELD_ELEMENT_TYPE = 'datefield' as const;

export const DateFieldElementType = z.literal(DATE_FIELD_ELEMENT_TYPE);

export type TDateFieldElementType = z.infer<typeof DateFieldElementType>;
