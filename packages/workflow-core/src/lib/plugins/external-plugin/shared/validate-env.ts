import { z } from 'zod';
import { logger } from '../../../logger';
import { removeTrailingSlash } from './remove-trailing-slash';

const EnvSchema = z.object({
  UNIFIED_API_TOKEN: z.string().min(1),
  UNIFIED_API_URL: z.string().url().transform(removeTrailingSlash),
  APP_API_URL: z.string().url().transform(removeTrailingSlash),
});

export const validateEnv = (pluginName: string) => {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = Object.entries(result.error.format()).reduce((acc, [name, value]) => {
      if (value && '_errors' in value) {
        acc[name] = value._errors.join(', ');
      }

      return acc;
    }, {} as Record<PropertyKey, string>);

    logger.error(`❌ ${pluginName} - Invalid environment variables:\n`, formattedErrors);

    throw new Error('Invalid environment variables');
  }

  return result.data;
};
