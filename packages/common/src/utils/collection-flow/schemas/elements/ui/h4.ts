import { z } from 'zod';

export const H4ElementParamsSchema = z.object({
  text: z.string(),
});

export const H4_UI_ELEMENT_TYPE = 'h4' as const;

export const H4ElementType = z.literal(H4_UI_ELEMENT_TYPE);

export type TH4ElementType = z.infer<typeof H4ElementType>;

export type TH4ElementParams = z.infer<typeof H4ElementParamsSchema>;
