import { ConfigService } from '@nestjs/config';
import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@/sentry/sentry.interceptor';
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
  _envName: string;
  _sentryDsn: string | undefined;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly prisma: PrismaService,
  ) {
    this._sentryDsn = this.configService.get('SENTRY_DSN');
    this._envName =
      this.configService.get('ENVIRONMENT_NAME') || this.configService.get('NODE_ENV', 'local');
  }

  onModuleInit() {
    const isEnabled = typeof this._sentryDsn !== 'undefined' && this._sentryDsn !== null;

    Sentry.init({
      enabled: isEnabled,
      dsn: this._sentryDsn,
      environment: this._envName,
      enableTracing: true,
      sampleRate: 1.0,
      normalizeDepth: 15,
      integrations: [
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Prisma({ client: this.prisma }),
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
        new Sentry.Integrations.Http({ tracing: true }),
        new RewriteFrames({
          root: global.__rootdir__,
        }),
      ],
    });
  }

  async onModuleDestroy() {
    if (!this._sentryDsn) {
      return;
    }

    await Sentry.close(2_000);
  }
}
