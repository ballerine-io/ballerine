import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@/sentry/sentry.interceptor';
import process from 'process';
import { RewriteFrames } from '@sentry/integrations';
import { PrismaService } from '@/prisma/prisma.service';

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
    if (!process.env.SENTRY_DSN) {
      return;
    }

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      debug: process.env.NODE_ENV !== 'production',
      environment: process.env.NODE_ENV,
      integrations: [
        new RewriteFrames({
          root: global.__rootdir__,
        }),
      ],
    });
  }

  async onModuleDestroy() {
    if (!process.env.SENTRY_DSN) {
      return;
    }

    await Sentry.close(2_000);
  }
}
