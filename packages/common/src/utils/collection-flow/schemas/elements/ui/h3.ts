import { z } from 'zod';

export const H3ElementParamsSchema = z.object({
  text: z.string(),
});

export const H3_UI_ELEMENT_TYPE = 'h3' as const;

export const H3ElementType = z.literal(H3_UI_ELEMENT_TYPE);

export type TH3ElementType = z.infer<typeof H3ElementType>;

export type TH3ElementParams = z.infer<typeof H3ElementParamsSchema>;
