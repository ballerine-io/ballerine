import { z } from 'zod';
import { FieldSchema } from '../common/field';
import { CommonOptionSchema } from '../common/option';

export const CHECKBOXLIST_FIELD_ELEMENT_TYPE = 'checkboxlistfield' as const;

export const CheckboxListParamsSchema = FieldSchema.extend({
  options: z.array(CommonOptionSchema),
});

export type TCheckboxListParams = z.infer<typeof CheckboxListParamsSchema>;

export const CheckboxListElementType = z.literal(CHECKBOXLIST_FIELD_ELEMENT_TYPE);

export type TCheckboxListElementType = z.infer<typeof CheckboxListElementType>;
