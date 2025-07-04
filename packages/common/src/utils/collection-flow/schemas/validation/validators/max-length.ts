import { z } from 'zod';

export const MaxLengthValidator = z.literal('maxLength');
export type TMaxLengthValidator = z.infer<typeof MaxLengthValidator>;

export const MaxLengthValidatorParamsSchema = z.object({
  maxLength: z.number(),
});

export type TMaxLengthValidatorParams = z.infer<typeof MaxLengthValidatorParamsSchema>;
