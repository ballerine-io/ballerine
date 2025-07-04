import { z } from 'zod';
import { FieldSchema } from '../common';

export const FIELD_LIST_ELEMENT_TYPE = 'fieldlist' as const;
export const FieldListElementType = z.literal(FIELD_LIST_ELEMENT_TYPE);

export type TFieldListElementType = z.infer<typeof FieldListElementType>;

export const FieldListParamsSchema = FieldSchema.extend({
  defaultValue: z.string().optional(),
  addButtonLabel: z.string().optional(),
  itemIndexLabel: z.string().optional(),
  removeButtonLabel: z.string().optional(),
});

export type TFieldListParams = z.infer<typeof FieldListParamsSchema>;
