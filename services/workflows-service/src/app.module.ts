import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ACLModule } from '@/common/access-control/acl.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServeStaticOptionsService } from './serve-static-options.service';
import { EndUserModule } from './end-user/end-user.module';
import { BusinessModule } from './business/business.module';
import { StorageModule } from './storage/storage.module';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WebhooksModule } from './webhooks/webhooks.module';
import { FilterModule } from '@/filter/filter.module';
import { env } from '@/env';
import { SentryModule } from '@/sentry/sentry.module';
import { RequestIdMiddleware } from '@/common/middlewares/request-id.middleware';
import { LogRequestInterceptor } from '@/common/interceptors/log-request.interceptor';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { ClsModule } from 'nestjs-cls';
import { FiltersModule } from '@/common/filters/filters.module';
import { UserSessionAuditMiddleware } from '@/common/middlewares/user-session-audit.middleware';
import { MetricsController } from '@/metrics/metrics.controller';
import { MetricsModule } from '@/metrics/metrics.module';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { RequestProjectMiddleware } from '@/common/middlewares/request-project.middleware';

@Module({
  controllers: [MetricsController],
  imports: [
    SentryModule,
    MulterModule.register({
      dest: './upload',
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    }),
    EventEmitterModule.forRoot(),
    WebhooksModule,
    // DevtoolsModule.register({
    //   http: process.env.NODE_ENV !== 'production',
    // }),
    UserModule,
    WorkflowModule,
    StorageModule,
    EndUserModule,
    BusinessModule,
    FilterModule,
    ACLModule,
    AuthModule,
    HealthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: env.ENV_FILE_NAME ?? '.env',
    }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    ClsModule.forRoot({
      global: true,
    }),
    AppLoggerModule,
    FiltersModule,
    MetricsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogRequestInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: SessionAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, UserSessionAuditMiddleware, RequestProjectMiddleware)
      .forRoutes('*');
  }
}
