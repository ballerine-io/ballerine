import { z } from 'zod';
import { SelectFieldParamsSchema } from './selectfield';

export const STATE_PICKER_FIELD_ELEMENT_TYPE = 'statepickerfield' as const;
export const StatePickerFieldElementType = z.literal(STATE_PICKER_FIELD_ELEMENT_TYPE);

export const StatePickerFieldParamsSchema = SelectFieldParamsSchema.extend({
  countryCodePath: z.string().optional(),
});

export type TStatePickerFieldParams = z.infer<typeof StatePickerFieldParamsSchema>;
