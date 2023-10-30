import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@/sentry/sentry.interceptor';
import { RewriteFrames } from '@sentry/integrations';
import { env } from '@/env';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class SentryModule implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    if (!env.SENTRY_DSN) {
      return;
    }

    Sentry.init({
      dsn: env.SENTRY_DSN,
      debug: env.NODE_ENV !== 'production',
      environment: env.ENVIRONMENT_NAME || env.NODE_ENV,
      integrations: [
        new RewriteFrames({
          root: global.__rootdir__,
        }),
      ],
    });
  }

  async onModuleDestroy() {
    if (!env.SENTRY_DSN) {
      return;
    }

    await Sentry.close(2_000);
  }
}
