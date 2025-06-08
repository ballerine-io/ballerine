import { z } from 'zod';

export const CommonOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type TCommonOption = z.infer<typeof CommonOptionSchema>;
