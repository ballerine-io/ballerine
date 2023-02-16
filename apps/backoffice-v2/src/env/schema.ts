import { z } from 'zod';

export const EnvSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']),
  VITE_API_URL: z
    .string()
    .url()
    .default('https://api-dev.ballerine.io/v2')
    .transform(
      v =>
        // i.e. /api/v2
        `/${v?.split('/').pop()}`,
    ),
  VITE_AUTH_ENABLED: z
    .preprocess(v => (typeof v !== 'string' ? v : JSON.parse(v)), z.boolean())
    .default(true),
  VITE_MOCK_SERVER: z
    .preprocess(v => (typeof v !== 'string' ? v : JSON.parse(v)), z.boolean())
    .default(true),
});
