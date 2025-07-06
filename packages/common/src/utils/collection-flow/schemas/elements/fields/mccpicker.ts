import { z } from 'zod';
import { FieldSchema } from '../common';

export const MCC_PICKER_FIELD_ELEMENT_TYPE = 'mccpickerfield' as const;
export const MCCPickerFieldElementType = z.literal(MCC_PICKER_FIELD_ELEMENT_TYPE);

export const MCCPickerFieldParamsSchema = FieldSchema.extend({
  optionNotFoundText: z.string().optional(),
});

export type TMCCPickerFieldParams = z.infer<typeof MCCPickerFieldParamsSchema>;
