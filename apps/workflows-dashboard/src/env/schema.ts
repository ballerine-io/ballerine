import { z } from 'zod';

export const EnvSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']),
  VITE_ENVIRONMENT_NAME: z.enum(['development', 'production', 'sandbox', 'local']),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_POSTHOG_HOST: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_SENTRY_PROPAGATION_TARGET: z.preprocess(value => {
    if (typeof value !== 'string') {
      return value;
    }

    return new RegExp(value);
  }, z.custom<RegExp>(value => value instanceof RegExp).optional()),
});
