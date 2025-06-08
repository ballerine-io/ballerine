import { z } from 'zod';
import { SelectFieldParamsSchema } from './selectfield';

export const INDUSTRIES_PICKER_FIELD_ELEMENT_TYPE = 'industriespickerfield' as const;
export const IndustriesPickerFieldElementType = z.literal(INDUSTRIES_PICKER_FIELD_ELEMENT_TYPE);

export const IndustriesPickerFieldParamsSchema = SelectFieldParamsSchema;

export type TIndustriesPickerFieldParams = z.infer<typeof IndustriesPickerFieldParamsSchema>;
