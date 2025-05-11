import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
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
import { validate } from '@/env-validate';
import { SentryModule } from '@/sentry/sentry.module';
import { RequestIdMiddleware } from '@/common/middlewares/request-id.middleware';
import { AxiosRequestErrorInterceptor } from '@/common/interceptors/axios-request-error.interceptor';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { ClsModule } from 'nestjs-cls';
import { FiltersModule } from '@/common/filters/filters.module';
import { UserSessionAuditMiddleware } from '@/common/middlewares/user-session-audit.middleware';
import { MetricsModule } from '@/metrics/metrics.module';
import { CustomerModule } from '@/customer/customer.module';
import { AuthKeyMiddleware } from '@/common/middlewares/auth-key.middleware';
import { ProjectModule } from '@/project/project.module';
import { AdminKeyMiddleware } from '@/common/middlewares/admin-key.middleware';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { CollectionFlowModule } from '@/collection-flow/collection-flow.module';
import { SalesforceModule } from '@/salesforce/salesforce.module';
import { UiDefinitionModule } from '@/ui-definition/ui-definition.module';
import { multerFactory } from '@/common/multer';
import { initHttpModule } from '@/common/http-service/http-config.service';
import { DataMigrationModule } from '@/data-migration/data-migration.module';
import { CaseManagementModule } from '@/case-management/case-management.module';
import { WorkflowModule } from '@/workflow/workflow.module';
import { TransactionModule } from '@/transaction/transaction.module';
import { AlertModule } from '@/alert/alert.module';
import { SwaggerController } from './swagger/swagger.controller';
import { WebhooksModule } from '@/webhooks/webhooks.module';
import { IncomingWebhooksModule } from '@/webhooks-incoming/webhooks-incoming.module';
import { BusinessReportModule } from '@/business-report/business-report.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from '@/workflow/cron/cron.module';
import { RuleEngineModule } from './rule-engine/rule-engine.module';
import { NotionModule } from '@/notion/notion.module';
import { SecretsManagerModule } from '@/secrets-manager/secrets-manager.module';
import { NoteModule } from '@/note/note.module';
import { MerchantMonitoringModule } from './merchant-monitoring/merchant-monitoring.module';
import { AnalyticsModule } from '@/common/analytics-logger/analytics.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { KycModule } from './kyc/kyc.module';
import { QueueModule } from '@/common/queue/queue.module';

@Module({
  controllers: [SwaggerController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.ENVIRONMENT_NAME}`, '.env'],
      cache: true,
    }),
    SentryModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerFactory,
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    MerchantMonitoringModule,
    WorkflowModule,
    WebhooksModule,
    IncomingWebhooksModule,
    NoteModule,
    UiDefinitionModule,
    StorageModule,
    DataMigrationModule,
    EndUserModule,
    CustomerModule,
    TransactionModule,
    BusinessReportModule,
    AlertModule,
    BusinessModule,
    ProjectModule,
    SalesforceModule,
    FilterModule,
    ACLModule,
    AuthModule,
    HealthModule,
    PrismaModule,
    ConfigModule.forRoot({
      validate,
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
    AnalyticsModule,
    FiltersModule,
    MetricsModule,
    CollectionFlowModule,
    CaseManagementModule,
    BusinessReportModule,
    CronModule,
    ScheduleModule.forRoot(),
    initHttpModule(),
    RuleEngineModule,
    NotionModule,
    SecretsManagerModule,
    KycModule,
    AssessmentsModule,
    QueueModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AxiosRequestErrorInterceptor,
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
