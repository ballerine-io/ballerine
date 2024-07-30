import { Injectable } from '@nestjs/common';
import { AwsSecretsManager } from '@/secrets-manager/aws-secrets-manager';
import { env } from '@/env';
import { InMemorySecretsManager } from '@/secrets-manager/in-memory-secrets-manager';

type SecretsManagerProvider = typeof env.SECRETS_MANAGER_PROVIDER;

@Injectable()
export class SecretsManagerFactory {
  create({ provider, customerId }: { provider: SecretsManagerProvider; customerId: string }) {
    switch (provider) {
      case 'aws-secrets-manager':
        return new AwsSecretsManager({
          customerId,
          environmentName: env.ENVIRONMENT_NAME,
          prefix: env.AWS_SECRETS_MANAGER_PREFIX,
        });
      case 'in-memory':
        return new InMemorySecretsManager({ customerId });
      default:
        provider satisfies never;
        throw new Error(`Unsupported Secret Manager provider: ${provider}`);
    }
  }
}
