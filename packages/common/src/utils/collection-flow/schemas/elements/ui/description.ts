import { z } from 'zod';

export const DescriptionElementParamsSchema = z.object({
  descriptionRaw: z.string(),
});

export const DESCRIPTION_UI_ELEMENT_TYPE = 'description' as const;

export const DescriptionElementType = z.literal(DESCRIPTION_UI_ELEMENT_TYPE);

export type TDescriptionElementType = z.infer<typeof DescriptionElementType>;

export type TDescriptionElementParams = z.infer<typeof DescriptionElementParamsSchema>;
