import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { configs, env, serverEnvSchema } from '@/env';
import { SentryModule } from '@/sentry/sentry.module';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import z from 'zod';
import { ClsModule } from 'nestjs-cls';
import { hashKey } from './customer/api-key/utils';
import { SecretsManagerModule } from '@/secrets-manager/secrets-manager.module';
import { BullMqModule } from '@/bull-mq/bull-mq.module';
import { OutgoingWebhooksModule } from '@/webhooks/outgoing-webhooks/outgoing-webhooks.module';

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

@Module({
  imports: [
    SentryModule,
    OutgoingWebhooksModule,
    HealthModule,
    PrismaModule,
    ClsModule.forRoot({
      global: true,
    }),
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      load: [configs],
      envFilePath: env.ENV_FILE_NAME ?? '.env',
    }),
    SecretsManagerModule,
    AppLoggerModule,
    BullMqModule,
  ],
})
export class WorkerAppModule {}
