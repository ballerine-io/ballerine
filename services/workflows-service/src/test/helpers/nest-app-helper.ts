import { Test } from '@nestjs/testing';
import { ACLModule } from '@/common/access-control/acl.module';
import { ACGuard } from 'nest-access-control';
import { AclFilterResponseInterceptor } from '@/common/access-control/interceptors/acl-filter-response.interceptor';
import { AclValidateRequestInterceptor } from '@/common/access-control/interceptors/acl-validate-request.interceptor';
import { CallHandler, ExecutionContext, INestApplication, Provider, Type } from '@nestjs/common';
import { EndUserModule } from '@/end-user/end-user.module';
import { EndUserService } from '@/end-user/end-user.service';
import { InstanceLink } from '@nestjs/core/injector/instance-links-host';
import console from 'console';

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
  modules: Type<any>[] = [],
) => {
  const moduleRef = await Test.createTestingModule({
    providers: [service, ...dependencies],
    imports: [...modules],
  }).compile();

  return moduleRef.get<typeof service>(service);
};

export const initiateNestApp = async (
  app: INestApplication,
  providers: Provider[] = [],
  controllers: Array<Type>,
  modules: Array<Type>,
) => {
  console.log(JSON.stringify(modules));
  const moduleRef = await Test.createTestingModule({
    providers: providers,
    controllers: controllers,
    imports: [ACLModule, ...modules],
  })
    .overrideGuard(ACGuard)
    .useValue(acGuard)
    .overrideInterceptor(AclFilterResponseInterceptor)
    .useValue(aclFilterResponseInterceptor)
    .overrideInterceptor(AclValidateRequestInterceptor)
    .useValue(aclValidateRequestInterceptor)
    .compile();

  app = moduleRef.createNestApplication();
  await app.init();

  return app;
};
