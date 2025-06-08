import { z } from 'zod';
import { FieldSchema } from '../common/field';
import { CommonOptionSchema } from '../common/option';

export const RADIO_FIELD_ELEMENT_TYPE = 'radiofield' as const;
export const RadioFieldElementType = z.literal(RADIO_FIELD_ELEMENT_TYPE);

export const RadioFieldParamsSchema = FieldSchema.extend({
  options: z.array(CommonOptionSchema),
});

export type TRadioFieldParams = z.infer<typeof RadioFieldParamsSchema>;
