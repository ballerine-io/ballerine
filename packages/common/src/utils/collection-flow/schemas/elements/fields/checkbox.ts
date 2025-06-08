import { z } from 'zod';
import { FieldSchema } from '../common/field';

export const CheckboxFieldParamsSchema = FieldSchema.extend({
  description: z.string().optional(),
  syncEvents: z.boolean().optional(),
});

export const CHECKBOX_FIELD_ELEMENT_TYPE = 'checkboxfield' as const;

export const CheckboxFieldElementType = z.literal(CHECKBOX_FIELD_ELEMENT_TYPE);

export type TCheckboxField = z.infer<typeof CheckboxFieldParamsSchema>;
