import { SecretsManager } from '@/secrets-manager/secret-manager';
import {
  CreateSecretCommand,
  GetSecretValueCommand,
  PutSecretValueCommand,
  ResourceNotFoundException,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { z } from 'zod';

const SecretStringSchema = z
  .string()
  .transform((value, ctx) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Secret value is not a valid JSON',
      });

      return z.NEVER;
    }
  })
  .pipe(z.record(z.string(), z.string()));

export class AwsSecretsManager implements SecretsManager {
  private client: SecretsManagerClient;
  private environmentName: string;
  private customerId: string;

  constructor({
    environmentName,
    customerId,
    awsRegion,
    awsAccessKeyId,
    awsSecretAccessKey,
  }: {
    environmentName: string;
    customerId: string;
    awsRegion: string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
  }) {
    this.client = new SecretsManagerClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
    this.environmentName = environmentName;
    this.customerId = customerId;
  }

  async get(key) {
    const data = await this.getSecret();

    return data[key] ?? null;
  }

  async set(key, value) {
    const data = await this.getSecret();

    data[key] = value;

    await this.client.send(
      new PutSecretValueCommand({
        SecretId: this.getSecretName(),
        SecretString: JSON.stringify(data),
      }),
    );
  }

  async delete(key) {
    const data = await this.getSecret();

    delete data[key];

    await this.client.send(
      new PutSecretValueCommand({
        SecretId: this.getSecretName(),
        SecretString: JSON.stringify(data),
      }),
    );
  }

  private async getSecret() {
    let secretString;

    try {
      const result = await this.client.send(
        new GetSecretValueCommand({
          SecretId: this.getSecretName(),
        }),
      );

      secretString = result.SecretString;
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        // Create secret lazily, only if it doesn't exist
        await this.createSecret();

        return {};
      }

      throw error;
    }

    return SecretStringSchema.parse(secretString);
  }

  private async createSecret() {
    await this.client.send(
      new CreateSecretCommand({
        Name: this.getSecretName(),
        SecretString: JSON.stringify({}),
      }),
    );
  }

  private getSecretName() {
    return `/${this.environmentName}/customers/${this.customerId}`;
  }
}
