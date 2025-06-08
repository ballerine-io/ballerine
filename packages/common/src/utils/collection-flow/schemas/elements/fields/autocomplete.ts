import { z } from 'zod';
import { FieldSchema } from '../common/field';
import { CommonOptionSchema } from '../common/option';

export const AUTOCOMPLETE_FIELD_ELEMENT_TYPE = 'autocompletefield' as const;

export const AutocompleteFieldElementType = z.literal(AUTOCOMPLETE_FIELD_ELEMENT_TYPE);

export const AutocompleteFieldParamsSchema = FieldSchema.extend({
  options: z.array(CommonOptionSchema),
});

export type TAutocompleteFieldParams = z.infer<typeof AutocompleteFieldParamsSchema>;
