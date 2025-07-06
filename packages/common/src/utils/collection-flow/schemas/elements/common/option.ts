import { z } from 'zod';

export const CommonOptionSchema = z.object({
  label: z.string(),
  value: z.string().optional(),
});

export type TCommonOption = z.infer<typeof CommonOptionSchema>;
