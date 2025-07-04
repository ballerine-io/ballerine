import { z } from 'zod';

export const MinimumValidator = z.literal('minimum');
export type TMinimumValidator = z.infer<typeof MinimumValidator>;

export const MinimumValidatorParamsSchema = z.object({
  minimum: z.number(),
});

export type TMinimumValidatorParams = z.infer<typeof MinimumValidatorParamsSchema>;
