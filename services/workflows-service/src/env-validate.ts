import z from 'zod';

import { hashKey } from '@/customer/api-key/utils';
import { serverEnvSchema } from '@/env';

export const validate = async (config: Record<string, unknown>) => {
  const zodEnvSchema = z
    .object(serverEnvSchema)
    .refine(data => data.HASHING_KEY_SECRET || data.HASHING_KEY_SECRET_BASE64, {
      message: 'At least one of HASHING_KEY_SECRET or HASHING_KEY_SECRET_BASE64 should be present',
      path: ['HASHING_KEY_SECRET', 'HASHING_KEY_SECRET_BASE64'],
    });

  const result = zodEnvSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.errors.map(zodIssue => ({
      message: `❌ ${zodIssue.message}`,
      path: zodIssue.path.join('.'), // Backwards compatibility - Legacy code message excepts array
    }));

    throw new Error(JSON.stringify(errors, null, 2));
  }

  // validate salt value
  await hashKey('check salt value');

  return result.data;
};
