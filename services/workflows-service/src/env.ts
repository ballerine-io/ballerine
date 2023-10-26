import { config } from 'dotenv';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

config({ path: '.env' });

export const env = createEnv({
  /*
   * clientPrefix is required.
   */
  clientPrefix: 'PUBLIC_',
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test', 'local']),
    ENV_FILE_NAME: z.string().optional(),
    BCRYPT_SALT: z.coerce.number().int().nonnegative().or(z.string()),
    JWT_SECRET_KEY: z.string(),
    JWT_EXPIRATION: z.string(),
    PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.coerce.number(),
    DB_URL: z.string().url(),
    SESSION_SECRET: z.string(),
    BACKOFFICE_CORS_ORIGIN: z.string().url(),
    HEADLESS_EXAMPLE_CORS_ORIGIN: z.string().url(),
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
