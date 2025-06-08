import { z } from 'zod';

export const FieldSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
});
