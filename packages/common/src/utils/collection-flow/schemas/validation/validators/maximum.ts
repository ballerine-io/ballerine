import { z } from 'zod';

export const MaximumValidator = z.literal('maximum');
export type TMaximumValidator = z.infer<typeof MaximumValidator>;

export const MaximumValidatorParamsSchema = z.object({
  maximum: z.number(),
});

export type TMaximumValidatorParams = z.infer<typeof MaximumValidatorParamsSchema>;
