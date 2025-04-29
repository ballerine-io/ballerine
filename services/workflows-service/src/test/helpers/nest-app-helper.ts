import { Test } from '@nestjs/testing';
import { ACLModule } from '@/common/access-control/acl.module';
import {
  DynamicModule,
  ForwardReference,
  INestApplication,
  NestMiddleware,
  Provider,
  Type,
} from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { ClsMiddleware, ClsModule, ClsService } from 'nestjs-cls';
import { AuthKeyMiddleware } from '@/common/middlewares/auth-key.middleware';
import { CustomerModule } from '@/customer/customer.module';
import { HttpModule } from '@nestjs/axios';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnalyticsModule } from '@/common/analytics-logger/analytics.module';
import { WorkflowRuntimeDataActorService } from '@/workflow/workflow-runtime-data-actor.service';
import { mockClsService } from '@/test/helpers/cls-service-helper';

export const commonTestingModules = [
  ClsModule.forRoot({
    global: true,
  }),
  AppLoggerModule,
  AnalyticsModule,
  CustomerModule,
  HttpModule,
  ConfigModule.forRoot({ isGlobal: true }),
  EventEmitterModule.forRoot(),
];

export const fetchServiceFromModule = async <T>(
  service: Type<T>,
  dependencies: Provider[] = [],
  modules:
    | Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>
    | Array<Type<unknown>> = [],
) => {
  const moduleRef = await Test.createTestingModule({
    providers: [service, ...dependencies, WorkflowRuntimeDataActorService, mockClsService()],
    imports: [...modules, ...commonTestingModules, ClsModule],
  }).compile();

  return moduleRef.get<typeof service>(service);
};

export const initiateNestApp = async (
  app: INestApplication,
  providers: Provider[] = [],
  controllers: Type[],
  modules: Type[],
  middlewares: Array<NestMiddleware['use']> = [],
) => {
  const moduleRef = await Test.createTestingModule({
    providers: [...providers, WorkflowRuntimeDataActorService, mockClsService()],
    controllers: controllers,
    imports: [ACLModule, ...modules, ...commonTestingModules, ClsModule],
  }).compile();

  app = moduleRef.createNestApplication();
  const middlewareInstnace = new AuthKeyMiddleware(app.get(ApiKeyService), app.get(ClsService));
  const clsMiddleware = new ClsMiddleware();

  middlewares.forEach(middleware => app.use(middleware));
  app.use(clsMiddleware.use.bind(clsMiddleware));
  app.use(middlewareInstnace.use.bind(middlewareInstnace));
  await app.init();

  return app;
};
