import { z } from 'zod';

export const ValidationRule = z.object({
  engine: z.literal('json-logic'),
  value: z.any(),
});

export type TValidationRule = z.infer<typeof ValidationRule>;
