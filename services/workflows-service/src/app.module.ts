import { MiddlewareConsumer, Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { UserModule } from './user/user.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ACLModule } from '@/common/access-control/acl.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { SecretsManagerModule } from '@/common/providers/secrets/secrets-manager.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServeStaticOptionsService } from './serve-static-options.service';
import { EndUserModule } from './end-user/end-user.module';
import { BusinessModule } from './business/business.module';
import { StorageModule } from './storage/storage.module';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { WebhooksModule } from './webhooks/webhooks.module';
import { FilterModule } from '@/filter/filter.module';
import { SessionAuthMiddleware } from '@/auth/session-auth.middleware';
import { VersionController } from './version/version.controller';

@Module({
  controllers: [VersionController],
  imports: [
    MulterModule.register({
      dest: './upload',
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    }),
    EventEmitterModule.forRoot(),
    WebhooksModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
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
    SecretsManagerModule,
    MorganModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: process.env.ENV_FILE_NAME || '.env' }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: MorganInterceptor('combined'),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionAuthMiddleware).forRoutes('internal/*');
  }
}
