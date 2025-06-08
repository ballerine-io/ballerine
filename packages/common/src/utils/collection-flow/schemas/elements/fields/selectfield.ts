import { z } from 'zod';
import { FieldSchema } from '../common/field';
import { CommonOptionSchema } from '../common/option';

export const SELECT_FIELD_ELEMENT_TYPE = 'selectfield' as const;
export const SelectFieldElementType = z.literal(SELECT_FIELD_ELEMENT_TYPE);

export const SelectFieldParamsSchema = FieldSchema.extend({
  optionNotFoundText: z.string().optional(),
  options: z.array(CommonOptionSchema),
});

export type TSelectFieldParams = z.infer<typeof SelectFieldParamsSchema>;
