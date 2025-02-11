import type { ZodFormattedError } from 'zod';
import { EnvSchema } from './schema';
import { terminal } from 'virtual:terminal';

export const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) => {
  return Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`;
    })
    .filter(Boolean);
};

const envSource = (globalThis as any).env?.VITE_API_URL ? (globalThis as any).env : import.meta.env;

const _env = EnvSchema.safeParse(envSource);

// TypeScript complains with !env.success
if (_env.success === false) {
  terminal.error('❌ Invalid environment variables:\n', ...formatErrors(_env.error.format()));

  throw new Error('Invalid environment variables');
}

export const env = _env.data;
