import { config } from 'dotenv';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

config({ path: '.env' });

// Custom transform function to parse time strings
function parseTimeString(timeString: string): number {
  const regex = /^(\d+)([smh])$/;
  const match = timeString.match(regex);

  if (!match && !Array.isArray(match)) {
    throw new Error('Invalid time format. Use formats like "1s", "5s", "10m", "1h".');
  }
  const value = parseInt((match as any)[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000; // Convert seconds to milliseconds
    case 'm':
      return value * 60 * 1000; // Convert minutes to milliseconds
    case 'h':
      return value * 60 * 60 * 1000; // Convert hours to milliseconds
    default:
      throw new Error('Invalid time unit. Use "s" for seconds, "m" for minutes, or "h" for hours.');
  }
}

export const env = createEnv({
  /*
   * clientPrefix is required.
   */
  clientPrefix: 'PUBLIC_',
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test', 'local']), // TODO: remove 'test', 'local'
    ENVIRONMENT_NAME: z.enum(['development', 'production', 'staging', 'test', 'local']),
    ENV_FILE_NAME: z.string().optional(),
    BCRYPT_SALT: z.coerce.number().int().nonnegative().or(z.string()),
    JWT_SECRET_KEY: z.string(),
    JWT_EXPIRATION: z
      .string()
      .default('1h')
      .refine(value => !isNaN(parseTimeString(value)), {
        message: 'Invalid time string format.',
      }),
    PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.coerce.number(),
    DB_URL: z.string().url(),
    SESSION_SECRET: z.string(),
    SESSION_EXPIRATION_IN_MINUTES: z.number().default(60),
    BACKOFFICE_CORS_ORIGIN: z.string().url(),
    WORKFLOW_DASHBOARD_CORS_ORIGIN: z.string().url(),
    KYB_EXAMPLE_CORS_ORIGIN: z.string().url(),
    AWS_S3_BUCKET_NAME: z.string().optional(),
    AWS_S3_BUCKET_KEY: z.string().optional(),
    AWS_S3_BUCKET_SECRET: z.string().optional(),
    API_KEY: z.string(),
    SENTRY_DSN: z.string().nullable().optional(),
    WEBHOOK_SECRET: z
      .string()
      .optional()
      .describe(
        'Deprecated. Should use `customer.authenticationConfiguration.webhookSharedSecret` instead.',
      ),
    ADMIN_API_KEY: z.string().optional(),
    MAIL_ADAPTER: z
      .enum(['sendgrid', 'log'])
      .default('sendgrid')
      .describe(
        `Which mail adapter to use. Use "log" during development to log emails to the console. In production, use "sendgrid" to send emails via SendGrid.`,
      ),
    UNIFIED_API_URL: z.string().url().describe('The URL of the Unified API.'),
    UNIFIED_API_TOKEN: z
      .string()
      .optional()
      .describe(
        'API token for the Unified API. Used for authenticating outgoing requests to the Unified API.',
      ),
    UNIFIED_API_SHARED_SECRET: z
      .string()
      .optional()
      .describe('Shared secret for the Unified API. Used for verifying incoming callbacks.'),
    SALESFORCE_API_VERSION: z
      .string()
      .optional()
      .default('58.0')
      .describe('Salesforce API version'),
    SALESFORCE_CONSUMER_KEY: z.string().optional().describe('Salesforce consumer key'),
    SALESFORCE_CONSUMER_SECRET: z.string().optional().describe('Salesforce consumer secret'),
    APP_API_URL: z.string().url().describe('The URL of the workflows-service API'),
  },
  client: {},
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: process.env,
  skipValidation: !!process.env.CI,
});

export const configs = () => {
  return env;
};
