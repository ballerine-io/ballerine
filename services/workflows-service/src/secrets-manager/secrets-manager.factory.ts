import { Injectable } from '@nestjs/common';
import { AwsSecretsManager } from '@/secrets-manager/aws-secrets-manager';
import { env } from '@/env';
import { InMemorySecretsManager } from '@/secrets-manager/in-memory-secrets-manager';

type SecretsManagerProvider = typeof env.SECRETS_MANAGER_PROVIDER;

@Injectable()
export class SecretsManagerFactory {
  create({ provider, customerId }: { provider: SecretsManagerProvider; customerId: string }) {
    switch (provider) {
      case 'aws-secret-manager':
        if (!env.AWS_SECRETS_MANAGER_REGION) {
          throw new Error('AWS_SECRETS_MANAGER_REGION is not set');
        }

        if (!env.AWS_SECRETS_MANAGER_ACCESS_KEY_ID) {
          throw new Error('AWS_SECRETS_MANAGER_ACCESS_KEY_ID is not set');
        }

        if (!env.AWS_SECRETS_MANAGER_SECRET_ACCESS_KEY) {
          throw new Error('AWS_SECRETS_MANAGER_SECRET_ACCESS_KEY is not set');
        }

        return new AwsSecretsManager({
          customerId,
          environmentName: env.ENVIRONMENT_NAME,
          prefix: env.AWS_SECRETS_MANAGER_PREFIX,
          awsRegion: env.AWS_SECRETS_MANAGER_REGION,
          awsAccessKeyId: env.AWS_SECRETS_MANAGER_ACCESS_KEY_ID,
          awsSecretAccessKey: env.AWS_SECRETS_MANAGER_SECRET_ACCESS_KEY,
        });
      case 'in-memory':
        return new InMemorySecretsManager({ customerId });
      default:
        provider satisfies never;
        throw new Error(`Unsupported Secret Manager provider: ${provider}`);
    }
  }
}
