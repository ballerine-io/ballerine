import { z } from 'zod';
import { SelectFieldParamsSchema } from './selectfield';

export const COUNTRY_PICKER_FIELD_ELEMENT_TYPE = 'countrypickerfield' as const;
export const CountryPickerFieldElementType = z.literal(COUNTRY_PICKER_FIELD_ELEMENT_TYPE);

export const CountryPickerFieldParamsSchema = SelectFieldParamsSchema;

export type TCountryPickerFieldParams = z.infer<typeof CountryPickerFieldParamsSchema>;
