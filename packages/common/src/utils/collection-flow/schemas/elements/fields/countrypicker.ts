import { z } from 'zod';
import { FieldSchema } from '../common';

export const CountryPickerFieldParamsSchema = FieldSchema.extend({
  optionNotFoundText: z.string().optional(),
});

export const COUNTRY_PICKER_FIELD_ELEMENT_TYPE = 'countrypickerfield' as const;
export const CountryPickerFieldElementType = z.literal(COUNTRY_PICKER_FIELD_ELEMENT_TYPE);

export type TCountryPickerFieldParams = z.infer<typeof CountryPickerFieldParamsSchema>;
