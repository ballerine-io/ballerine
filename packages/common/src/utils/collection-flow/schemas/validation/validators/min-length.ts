import { z } from 'zod';

export const MinLengthValidator = z.literal('minLength');
export type TMinLengthValidator = z.infer<typeof MinLengthValidator>;

export const MinLengthValidatorParamsSchema = z.object({
  minLength: z.number(),
});

export type TMinLengthValidatorParams = z.infer<typeof MinLengthValidatorParamsSchema>;
