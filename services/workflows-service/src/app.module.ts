import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClsModule } from 'nestjs-cls';
import { z } from 'zod';

import { AlertModule } from '@/alert/alert.module';
import { BusinessReportModule } from '@/business-report/business-report.module';
import { CaseManagementModule } from '@/case-management/case-management.module';
import { CollectionFlowModule } from '@/collection-flow/collection-flow.module';
import { ACLModule } from '@/common/access-control/acl.module';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { FiltersModule } from '@/common/filters/filters.module';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { initHttpModule } from '@/common/http-service/http-config.service';
import { AxiosRequestErrorInterceptor } from '@/common/interceptors/axios-request-error.interceptor';
import { AdminKeyMiddleware } from '@/common/middlewares/admin-key.middleware';
import { AuthKeyMiddleware } from '@/common/middlewares/auth-key.middleware';
import { RequestIdMiddleware } from '@/common/middlewares/request-id.middleware';
import { UserSessionAuditMiddleware } from '@/common/middlewares/user-session-audit.middleware';
import { multerFactory } from '@/common/multer';
import { CustomerModule } from '@/customer/customer.module';
import { DataMigrationModule } from '@/data-migration/data-migration.module';
import { configs, env, serverEnvSchema } from '@/env';
import { FilterModule } from '@/filter/filter.module';
import { MetricsModule } from '@/metrics/metrics.module';
import { NoteModule } from '@/note/note.module';
import { NotionModule } from '@/notion/notion.module';
import { ProjectModule } from '@/project/project.module';
import { SalesforceModule } from '@/salesforce/salesforce.module';
import { SecretsManagerModule } from '@/secrets-manager/secrets-manager.module';
import { SentryModule } from '@/sentry/sentry.module';
import { TransactionModule } from '@/transaction/transaction.module';
import { UiDefinitionModule } from '@/ui-definition/ui-definition.module';
import { CronModule } from '@/workflow/cron/cron.module';
import { WorkflowModule } from '@/workflow/workflow.module';

import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { hashKey } from './customer/api-key/utils';
import { EndUserModule } from './end-user/end-user.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { RuleEngineModule } from './rule-engine/rule-engine.module';
import { ServeStaticOptionsService } from './serve-static-options.service';
import { StorageModule } from './storage/storage.module';
import { SwaggerController } from './swagger/swagger.controller';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhooks/webhook.module';

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
    WorkflowModule,
    WebhookModule,
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
