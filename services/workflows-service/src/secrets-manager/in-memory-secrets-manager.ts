import { SecretsManager } from '@/secrets-manager/secrets-manager';

const secretsStore: Record<string, Record<string, string>> = {};

export class InMemorySecretsManager implements SecretsManager {
  private customerId: string;

  constructor({ customerId }: { customerId: string }) {
    this.customerId = customerId;
  }

  async getAll() {
    return secretsStore[this.customerId] || {};
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
