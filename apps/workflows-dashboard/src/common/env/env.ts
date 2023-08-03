import type { ZodFormattedError } from 'zod';
import { EnvSchema } from './schema';
import { terminal } from 'virtual:terminal';

export const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) => {
  console.info({
    errors,
  });

  return Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`;
    })
    .filter(Boolean);
};

const _env = EnvSchema.safeParse(import.meta.env);

// TypeScript complains with !env.success
if (_env.success === false) {
  terminal.error('❌ Invalid environment variables:\n', ...formatErrors(_env.error.format()));
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
