import { z } from 'zod';

export const H1ElementParamsSchema = z.object({
  text: z.string(),
});

export const H1_UI_ELEMENT_TYPE = 'h1' as const;

export const H1ElementType = z.literal(H1_UI_ELEMENT_TYPE);

export type TH1ElementType = z.infer<typeof H1ElementType>;

export type TH1ElementParams = z.infer<typeof H1ElementParamsSchema>;
