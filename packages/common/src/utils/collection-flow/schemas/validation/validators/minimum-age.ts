import { z } from 'zod';

export const MinimumAgeValidator = z.literal('minimumAge');
export type TMinimumAgeValidator = z.infer<typeof MinimumAgeValidator>;

export const MinimumAgeValidatorParamsSchema = z.object({
  minimumAge: z.number(),

  //strict validation includes days and months in to the calculation
  strict: z.boolean().optional(),
});

export type TMinimumAgeValidatorParams = z.infer<typeof MinimumAgeValidatorParamsSchema>;
