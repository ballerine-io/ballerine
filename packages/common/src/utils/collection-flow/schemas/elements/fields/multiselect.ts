import { z } from 'zod';
import { FieldSchema } from '../common/field';
import { CommonOptionSchema } from '../common/option';

export const MULTISELECT_FIELD_ELEMENT_TYPE = 'multiselectfield' as const;
export const MultiSelectFieldElementType = z.literal(MULTISELECT_FIELD_ELEMENT_TYPE);

export const MultiSelectFieldParamsSchema = FieldSchema.extend({
  options: z.array(CommonOptionSchema),
});

export type TMultiSelectFieldParams = z.infer<typeof MultiSelectFieldParamsSchema>;
