import { z } from 'zod';

export const HomeSearchSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type DateRange = z.infer<typeof HomeSearchSchema>;
