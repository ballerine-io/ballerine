import { Test } from '@nestjs/testing';
import { ACLModule } from '@/common/access-control/acl.module';
// import { ACGuard } from 'nest-access-control';
// import { AclFilterResponseInterceptor } from '@/common/access-control/interceptors/acl-filter-response.interceptor';
// import { AclValidateRequestInterceptor } from '@/common/access-control/interceptors/acl-validate-request.interceptor';
import {
  CallHandler,
  DynamicModule,
  ExecutionContext,
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
import { CustomerService } from '@/customer/customer.service';
import { HttpModule } from '@nestjs/axios';

export const commonTestingModules = [
  ClsModule.forRoot({
    global: true,
  }),
  AppLoggerModule,
  CustomerModule,
  HttpModule,
];

const acGuard = {
  canActivate: () => {
    return true;
  },
};

const aclValidateRequestInterceptor = {
  intercept: (_context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

const aclFilterResponseInterceptor = {
  intercept: (_context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

export const fetchServiceFromModule = async <T>(
  service: Type<T>,
  dependencies: Provider[] = [],
  modules:
    | Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>
    | Array<Type<unknown>> = [],
) => {
  const moduleRef = await Test.createTestingModule({
    providers: [service, ...dependencies],
    imports: [...modules, ...commonTestingModules],
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
    providers: providers,
    controllers: controllers,
    imports: [ACLModule, ...modules, ...commonTestingModules],
  })
    // .overrideGuard(ACGuard)
    // .useValue(acGuard)
    // .overrideInterceptor(AclFilterResponseInterceptor)
    // .useValue(aclFilterResponseInterceptor)
    // .overrideInterceptor(AclValidateRequestInterceptor)
    // .useValue(aclValidateRequestInterceptor)
    .compile();

  app = moduleRef.createNestApplication();
  const middlewareInstnace = new AuthKeyMiddleware(app.get(CustomerService), app.get(ClsService));
  const clsMiddleware = new ClsMiddleware();

  middlewares.forEach(middleware => app.use(middleware));
  app.use(clsMiddleware.use.bind(clsMiddleware));
  app.use(middlewareInstnace.use.bind(middlewareInstnace));
  await app.init();

  return app;
};
