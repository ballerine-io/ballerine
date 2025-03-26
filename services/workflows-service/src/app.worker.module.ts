import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { configs, env, validate } from '@/env';
import { SecretsManagerModule } from '@/secrets-manager/secrets-manager.module';
import { SentryModule } from '@/sentry/sentry.module';
import { WebhooksModule } from '@/webhooks/webhooks.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    SentryModule,
    WebhooksModule,
    HealthModule,
    PrismaModule,
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      load: [configs],
      envFilePath: env.ENV_FILE_NAME ?? '.env',
    }),
    SecretsManagerModule,
    AppLoggerModule,
  ],
})
export class WorkerAppModule {}
