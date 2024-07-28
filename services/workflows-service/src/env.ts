import { config } from 'dotenv';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import { Base64 } from 'js-base64';

const path = process.env.CI ? '.env.example' : '.env';

console.log('Loading environment variables from', path);

config({ path });

const urlArrayTransformer = (value: string) => {
  const urlSchema = z.string().url();
  const urlArray = value.split(',');

  return urlArray.map(url => urlSchema.parse(url)).sort((a, b) => a.length - b.length);
};

export const serverEnvSchema = {
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test', 'local']), // TODO: remove 'test', 'local'
  ENVIRONMENT_NAME: z.enum(['development', 'sandbox', 'production', 'staging', 'test', 'local']),
  ENV_FILE_NAME: z.string().optional(),
  BCRYPT_SALT: z.coerce.number().int().nonnegative().or(z.string()),
  PORT: z.coerce.number(),
  DB_URL: z.string().url(),
  SESSION_SECRET: z.string(),
  HASHING_KEY_SECRET: z.string().optional(),
  HASHING_KEY_SECRET_BASE64: z.string().refine(Base64.isValid).optional(),
  SESSION_EXPIRATION_IN_MINUTES: z.coerce.number().nonnegative().gt(0).default(60),
  BACKOFFICE_CORS_ORIGIN: z.string().transform(urlArrayTransformer),
  WORKFLOW_DASHBOARD_CORS_ORIGIN: z.string().transform(urlArrayTransformer),
  KYB_EXAMPLE_CORS_ORIGIN: z.string().transform(urlArrayTransformer),
  KYC_EXAMPLE_CORS_ORIGIN: z
    .string()
    .optional()
    .transform(value => {
      if (value === undefined) {
        return value;
      }

      return urlArrayTransformer(value);
    }),
  AWS_S3_BUCKET_NAME: z.string().optional(),
  AWS_S3_BUCKET_KEY: z.string().optional(),
  AWS_S3_BUCKET_SECRET: z.string().optional(),
  API_KEY: z.string(),
  SENTRY_DSN: z.string().nullable().optional(),
  RELEASE: z.string().nullable().optional(),
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
  SALESFORCE_API_VERSION: z.string().optional().default('58.0').describe('Salesforce API version'),
  SALESFORCE_CONSUMER_KEY: z.string().optional().describe('Salesforce consumer key'),
  SALESFORCE_CONSUMER_SECRET: z.string().optional().describe('Salesforce consumer secret'),
  APP_API_URL: z.string().url().describe('The URL of the workflows-service API'),
  COLLECTION_FLOW_URL: z.string().url().optional().describe('The URL of the Collection Flow App'),
  WEB_UI_SDK_URL: z.string().url().optional().describe('The URL of the Web UI SDK App'),
  DATA_MIGRATION_BUCKET_NAME: z
    .string()
    .optional()
    .describe('Bucket name of Data migration folders'),
  NOTION_API_KEY: z.string().describe('Notion API key'),
  SECRETS_MANAGER_PROVIDER: z
    .enum(['aws-secret-manager', 'in-memory'])
    .default('aws-secret-manager')
    .describe('Secrets Manager provider'),

  // AWS Secrets Manager
  AWS_SECRETS_MANAGER_PREFIX: z
    .string()
    .optional()
    .default('/dev/customers')
    .describe('AWS Secrets Manager prefix'),
  AWS_SECRETS_MANAGER_REGION: z.string().optional().describe('AWS Secrets Manager region'),
  AWS_SECRETS_MANAGER_ACCESS_KEY_ID: z
    .string()
    .optional()
    .describe('AWS Secrets Manager access key ID'),
  AWS_SECRETS_MANAGER_SECRET_ACCESS_KEY: z
    .string()
    .optional()
    .describe('AWS Secrets Manager secret access key'),
};

if (!process.env['ENVIRONMENT_NAME'] || process.env['ENVIRONMENT_NAME'] === 'local') {
  const severEnvVars: Record<string, string> = {};

  // Use a for loop to populate severEnvVars
  for (const key of Object.keys(serverEnvSchema)) {
    if (process.env[key]) {
      severEnvVars[key] = process.env[key] as string;
    }
  }

  console.log('Environment variables loaded', severEnvVars);
}

export const env = createEnv({
  /*
   * clientPrefix is required.
   */
  clientPrefix: 'PUBLIC_',
  server: serverEnvSchema,
  client: {},
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: process.env,
});

export const configs = () => {
  return env;
};
