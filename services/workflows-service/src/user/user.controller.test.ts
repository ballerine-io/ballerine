/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { CallHandler, ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MorganModule } from 'nest-morgan';
import { ACGuard } from 'nest-access-control';
import { DefaultAuthGuard } from '../auth/default-auth.guard';
import { ACLModule } from '@/common/access-control/acl.module';
import { AclFilterResponseInterceptor } from '@/common/access-control/interceptors/acl-filter-response.interceptor';
import { AclValidateRequestInterceptor } from '@/common/access-control/interceptors/acl-validate-request.interceptor';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as errors from '@/errors';

const nonExistingId = 'nonExistingId';
const existingId = 'existingId';
const CREATE_INPUT = {
  createdAt: new Date(),
  id: 'exampleId',
  password: 'examplePassword',
  updatedAt: new Date(),
  email: 'exampleUsername',
};
const CREATE_RESULT = {
  createdAt: new Date(),
  id: 'exampleId',
  password: 'examplePassword',
  updatedAt: new Date(),
  email: 'exampleUsername',
};
const FIND_MANY_RESULT = [
  {
    createdAt: new Date(),
    id: 'exampleId',
    password: 'examplePassword',
    updatedAt: new Date(),
    email: 'exampleUsername',
  },
];
const FIND_ONE_RESULT = {
  createdAt: new Date(),
  id: 'exampleId',
  password: 'examplePassword',
  updatedAt: new Date(),
  email: 'exampleUsername',
};

const service = {
  create() {
    return CREATE_RESULT;
  },
  list: () => FIND_MANY_RESULT,
  getById: (id: string) => {
    switch (id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        throw new errors.NotFoundException(
          `No resource was found for {"${'id'}":"${nonExistingId}"}`,
        );
    }
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ['operator'],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

const aclFilterResponseInterceptor = {
  intercept: (_context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};
const aclValidateRequestInterceptor = {
  intercept: (_context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

describe('User', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: service,
        },
      ],
      controllers: [UserController],
      imports: [MorganModule.forRoot(), ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('POST /users', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      });
  });

  test('GET /users', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0]!.createdAt.toISOString(),
          updatedAt: FIND_MANY_RESULT[0]!.updatedAt.toISOString(),
        },
      ]);
  });

  test('GET /users/:id non existing', async () => {
    await request(app.getHttpServer())
      .get(`/users/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${'id'}":"${nonExistingId}"}`,
        error: 'Not Found',
      });
  });

  test('GET /users/:id existing', async () => {
    await request(app.getHttpServer())
      .get(`/users/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
      });
  });

  test('POST /users existing resource', async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post('/users')
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
