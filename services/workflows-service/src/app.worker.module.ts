import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';

import { AnalyticsModule } from '@/common/analytics-logger/analytics.module';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { QueueModule } from '@/common/queue/queue.module';
import { configs, env } from '@/env';
import { validate } from '@/env-validate';
import { SecretsManagerModule } from '@/secrets-manager/secrets-manager.module';
import { SentryModule } from '@/sentry/sentry.module';
import { WebhooksModule } from '@/webhooks/webhooks.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
    }),
    SentryModule,
    AnalyticsModule,
    WebhooksModule,
    HealthModule,
    PrismaModule,
    AlertModule,
    QueueModule,
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
