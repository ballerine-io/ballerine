import { z } from 'zod';
import { FieldSchema } from '../common';

export const TAX_ID_PICKER_FIELD_ELEMENT_TYPE = 'taxidpickerfield' as const;
export const TaxIdPickerFieldElementType = z.literal(TAX_ID_PICKER_FIELD_ELEMENT_TYPE);

export const TaxIdPickerFieldParamsSchema = FieldSchema.extend({
  countryCodePath: z.string(),
  optionNotFoundText: z.string().optional(),
});

export type TTaxIdPickerFieldParams = z.infer<typeof TaxIdPickerFieldParamsSchema>;
