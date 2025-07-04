import { z } from 'zod';

export const PatternValidator = z.literal('pattern');
export type TPatternValidator = z.infer<typeof PatternValidator>;

export const PatternValidatorParamsSchema = z.object({
  pattern: z.string(),
  flags: z.string().optional(),
});

export type TPatternValidatorParams = z.infer<typeof PatternValidatorParamsSchema>;
