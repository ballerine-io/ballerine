import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ACLModule } from '@/common/access-control/acl.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServeStaticOptionsService } from './serve-static-options.service';
import { EndUserModule } from './end-user/end-user.module';
import { BusinessModule } from './business/business.module';
import { StorageModule } from './storage/storage.module';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FilterModule } from '@/filter/filter.module';
import { configs, env } from '@/env';
import { SentryModule } from '@/sentry/sentry.module';
import { RequestIdMiddleware } from '@/common/middlewares/request-id.middleware';
import { LogRequestInterceptor } from '@/common/interceptors/log-request.interceptor';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { ClsModule } from 'nestjs-cls';
import { FiltersModule } from '@/common/filters/filters.module';
import { UserSessionAuditMiddleware } from '@/common/middlewares/user-session-audit.middleware';
import { MetricsController } from '@/metrics/metrics.controller';
import { MetricsModule } from '@/metrics/metrics.module';
import { CustomerModule } from '@/customer/customer.module';
import { AuthKeyMiddleware } from '@/common/middlewares/auth-key.middleware';
import { ProjectModule } from '@/project/project.module';
import { AdminKeyMiddleware } from '@/common/middlewares/admin-key.middleware';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { CollectionFlowModule } from '@/collection-flow/collection-flow.module';
import { SalesforceModule } from '@/salesforce/salesforce.module';
import { UiDefinitionModule } from '@/ui-definition/ui-definition.module';
import { multerFactory } from './common/multer';
import { DataMigrationModule } from "@/data-migration/data-migration.module";

@Module({
  controllers: [MetricsController],
  imports: [
    SentryModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerFactory,
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    WorkflowModule,
    UiDefinitionModule,
    StorageModule,
    DataMigrationModule,
    EndUserModule,
    CustomerModule,
    BusinessModule,
    ProjectModule,
    SalesforceModule,
    FilterModule,
    ACLModule,
    AuthModule,
    HealthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
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
    CollectionFlowModule,
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
      .apply(RequestIdMiddleware, UserSessionAuditMiddleware, AuthKeyMiddleware, AdminKeyMiddleware)
      .forRoutes('*');
  }
}
