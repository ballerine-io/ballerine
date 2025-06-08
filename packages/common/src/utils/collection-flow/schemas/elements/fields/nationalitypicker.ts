import { z } from 'zod';
import { SelectFieldParamsSchema } from './selectfield';

export const NATIONALITY_PICKER_FIELD_ELEMENT_TYPE = 'nationalitypickerfield' as const;
export const NationalityPickerFieldElementType = z.literal(NATIONALITY_PICKER_FIELD_ELEMENT_TYPE);

export const NationalityPickerFieldParamsSchema = SelectFieldParamsSchema;

export type TNationalityPickerFieldParams = z.infer<typeof NationalityPickerFieldParamsSchema>;
