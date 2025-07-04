import { z } from 'zod';

export const SUBMIT_BUTTON_ELEMENT_TYPE = 'submitbutton' as const;
export const SubmitButtonElementType = z.literal(SUBMIT_BUTTON_ELEMENT_TYPE);

export const SubmitParamsSchema = z.object({
  text: z.string(),
  disableWhenFormIsInvalid: z.boolean().optional(),
});

export type TSubmitParams = z.infer<typeof SubmitParamsSchema>;
