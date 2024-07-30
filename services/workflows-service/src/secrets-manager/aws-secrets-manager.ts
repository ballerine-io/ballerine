import { SecretsManager } from '@/secrets-manager/secrets-manager';
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
  private prefix: string;
  private customerId: string;

  constructor({
    environmentName,
    prefix,
    customerId,
  }: {
    environmentName: string;
    prefix: string;
    customerId: string;
  }) {
    this.client = new SecretsManagerClient();
    this.environmentName = environmentName;
    this.prefix = prefix;
    this.customerId = customerId;
  }

  async getAll() {
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

  async set(data: Record<string, string>) {
    const dataToSet = {
      ...(await this.getAll()),
      ...data,
    };

    await this.client.send(
      new PutSecretValueCommand({
        SecretId: this.getSecretName(),
        SecretString: JSON.stringify(dataToSet),
      }),
    );
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
    return `/${this.environmentName}/${this.prefix}/${this.customerId}`;
  }
}
