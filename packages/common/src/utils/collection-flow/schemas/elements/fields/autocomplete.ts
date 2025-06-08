import { z } from 'zod';
import { FieldSchema } from '../common/field';

export const AutocompleteFieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const AUTOCOMPLETE_FIELD_ELEMENT_TYPE = 'autocompletefield' as const;

export const AutocompleteFieldElementType = z.literal(AUTOCOMPLETE_FIELD_ELEMENT_TYPE);

export type TAutocompleteFieldOption = z.infer<typeof AutocompleteFieldOptionSchema>;

export const AutocompleteFieldParamsSchema = FieldSchema.extend({
  options: z.array(AutocompleteFieldOptionSchema),
});

export type TAutocompleteField = z.infer<typeof AutocompleteFieldParamsSchema>;
