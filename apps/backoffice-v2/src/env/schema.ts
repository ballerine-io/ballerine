import { z } from 'zod';

export const EnvSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']),
  VITE_API_URL: z.string().url().default('https://api-dev.ballerine.io/v2'),
  VITE_API_KEY: z.string(),
  VITE_AUTH_ENABLED: z.coerce.boolean().default(true),
  VITE_MOCK_SERVER: z.coerce.boolean().default(true),
  VITE_POLLING_INTERVAL: z.coerce
    .number()
    .transform(v => v * 1000)
    .or(z.literal(false))
    .catch(false),
});
