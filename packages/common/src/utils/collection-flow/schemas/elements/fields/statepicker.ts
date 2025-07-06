import { z } from 'zod';
import { FieldSchema } from '../common';

export const STATE_PICKER_FIELD_ELEMENT_TYPE = 'statepickerfield' as const;
export const StatePickerFieldElementType = z.literal(STATE_PICKER_FIELD_ELEMENT_TYPE);

export const StatePickerFieldParamsSchema = FieldSchema.extend({
  countryCodePath: z.string(),
  optionNotFoundText: z.string().optional(),
});

export type TStatePickerFieldParams = z.infer<typeof StatePickerFieldParamsSchema>;
