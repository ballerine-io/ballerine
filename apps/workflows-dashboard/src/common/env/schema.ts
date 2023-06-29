import { z } from 'zod';

export const EnvSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']),
  VITE_API_URL: z.string().url().default('https://api-dev.ballerine.io/v2'),
  VITE_IMAGE_LOGO_URL: z.string().optional(),
});
