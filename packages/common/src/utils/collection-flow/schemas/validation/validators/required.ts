import { z } from 'zod';

export const RequiredValidator = z.literal('required');
export type TRequiredValidator = z.infer<typeof RequiredValidator>;

export const RequiredValidatorParamsSchema = z.object({
  required: z.boolean(),
});

export type TRequiredValidatorParams = z.infer<typeof RequiredValidatorParamsSchema>;
