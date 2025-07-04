import { z } from 'zod';

export const FormatValidator = z.literal('format');
export type TFormatValidator = z.infer<typeof FormatValidator>;

export const FormatValidatorParamsSchema = z.object({
  format: z.union([z.literal('phone'), z.literal('email')]),
});

export type TFormatValidatorParams = z.infer<typeof FormatValidatorParamsSchema>;
