import { z } from 'zod';

export const dateRangeSchema = z.object({
  from: z
    .string()
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  to: z
    .string()
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
});

export type DateRange = z.infer<typeof dateRangeSchema>;
