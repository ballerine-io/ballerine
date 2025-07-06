import { z } from 'zod';
import { FieldSchema } from '../common';

export const NATIONALITY_PICKER_FIELD_ELEMENT_TYPE = 'nationalitypickerfield' as const;
export const NationalityPickerFieldElementType = z.literal(NATIONALITY_PICKER_FIELD_ELEMENT_TYPE);

export const NationalityPickerFieldParamsSchema = FieldSchema.extend({
  optionNotFoundText: z.string().optional(),
});

export type TNationalityPickerFieldParams = z.infer<typeof NationalityPickerFieldParamsSchema>;
