import { SecretsManager } from '@/secrets-manager/secrets-manager';
import { env } from '@/env';
import { camelCase } from 'lodash';

const inMemoryEnvProvidedSecrets = Object.entries(env).reduce((acc, [key, value]) => {
  if (!key.startsWith('IN_MEMORIES_SECRET_')) {
    return acc;
  }

  const secretKey = key.replace('IN_MEMORIES_SECRET_', '');

  acc[camelCase(secretKey)] = value;

  return acc;
}, {} as Record<string, any>);

const secretsStore: Record<string, Record<string, string>> = {};

export class InMemorySecretsManager implements SecretsManager {
  private customerId: string;

  constructor({ customerId }: { customerId: string }) {
    this.customerId = customerId;
  }

  async getAll() {
    let secrets = secretsStore[this.customerId] || {};

    if (env.ENVIRONMENT_NAME !== 'local') {
      return secrets;
    }

    secrets = {
      ...inMemoryEnvProvidedSecrets,
      ...secrets,
    };

    return secrets;
  }

  async set(data: Record<string, string>) {
    secretsStore[this.customerId] = {
      ...(await this.getAll()),
      ...data,
    };
  }

  async delete(key: string) {
    if (secretsStore[this.customerId]) {
      delete secretsStore[this.customerId]![key];
    }
  }
}
