import { z } from 'zod';
import { SelectFieldParamsSchema } from './selectfield';

export const LOCALE_PICKER_FIELD_ELEMENT_TYPE = 'localepickerfield' as const;
export const LocalePickerFieldElementType = z.literal(LOCALE_PICKER_FIELD_ELEMENT_TYPE);

export const LocalePickerFieldParamsSchema = SelectFieldParamsSchema;

export type TLocalePickerFieldParams = z.infer<typeof LocalePickerFieldParamsSchema>;
