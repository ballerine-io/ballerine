import { z } from 'zod';
import { FieldSchema } from '../common/field';

export const PHONE_FIELD_ELEMENT_TYPE = 'phonefield' as const;
export const PhoneFieldElementType = z.literal(PHONE_FIELD_ELEMENT_TYPE);

export const PhoneFieldParamsSchema = FieldSchema.extend({
  defaultCountry: z.string().optional(),
});

export type TPhoneFieldParams = z.infer<typeof PhoneFieldParamsSchema>;
