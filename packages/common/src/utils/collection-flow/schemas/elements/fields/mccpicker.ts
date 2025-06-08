import { z } from 'zod';
import { SelectFieldParamsSchema } from './selectfield';

export const MCC_PICKER_FIELD_ELEMENT_TYPE = 'mccpickerfield' as const;
export const MCCPickerFieldElementType = z.literal(MCC_PICKER_FIELD_ELEMENT_TYPE);

export const MCCPickerFieldParamsSchema = SelectFieldParamsSchema;

export type TMCCPickerFieldParams = z.infer<typeof MCCPickerFieldParamsSchema>;
