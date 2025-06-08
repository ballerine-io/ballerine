import { z } from 'zod';
import { FieldSchema } from '../common/field';

export const TEXT_FIELD_ELEMENT_TYPE = 'textfield' as const;
export const TextFieldElementType = z.literal(TEXT_FIELD_ELEMENT_TYPE);

export const TextFieldParamsSchema = FieldSchema.extend({
  valueType: z.union([z.literal('integer'), z.literal('number'), z.literal('string')]).optional(),
  style: z.union([z.literal('text'), z.literal('textarea')]).optional(),
});

export type TTextFieldParams = z.infer<typeof TextFieldParamsSchema>;
