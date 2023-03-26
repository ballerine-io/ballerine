import { Test } from '@nestjs/testing';
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import request from 'supertest';
import { MorganModule } from 'nest-morgan';
import { ACGuard } from 'nest-access-control';
import { DefaultAuthGuard } from '../auth/default-auth.guard';
import { ACLModule } from '../access-control/acl.module';
import { AclFilterResponseInterceptor } from '../access-control/interceptors/acl-filter-response.interceptor';
import { AclValidateRequestInterceptor } from '../access-control/interceptors/acl-validate-request.interceptor';
import { map } from 'rxjs';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowService } from './workflow.service';

const nonExistingId = 'nonExistingId';
const existingId = 'existingId';
const CREATE_INPUT = {
  createdAt: new Date(),
  id: 'exampleId',
  name: 'exampleName',
  updatedAt: new Date(),
};
const CREATE_RESULT = {
  createdAt: new Date(),
  id: 'exampleId',
  name: 'exampleName',
  updatedAt: new Date(),
};
const FIND_MANY_RESULT = [
  {
    createdAt: new Date(),

    id: 'exampleId',

    name: 'exampleName',
    updatedAt: new Date(),
  },
];
const FIND_ONE_RESULT = {
  createdAt: new Date(),
  id: 'exampleId',
  name: 'exampleName',
  updatedAt: new Date(),
};

const service = {
  create() {
    return CREATE_RESULT;
  },
  findMany: () => FIND_MANY_RESULT,
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        return null;
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
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map(data => {
        return data;
      }),
    );
  },
};
const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

describe('Workflow', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: WorkflowService,
          useValue: service,
        },
      ],
      controllers: [WorkflowControllerExternal],
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

  test('POST /workflows', async () => {
    await request(app.getHttpServer())
      .post('/workflows')
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      });
  });

  test('GET /workflows', async () => {
    await request(app.getHttpServer())
      .get('/workflows')
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0]!.createdAt.toISOString(),
          updatedAt: FIND_MANY_RESULT[0]!.updatedAt.toISOString(),
        },
      ]);
  });

  test('GET /workflows/:id non existing', async () => {
    await request(app.getHttpServer())
      .get(`${'/workflows'}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${'id'}":"${nonExistingId}"}`,
        error: 'Not Found',
      });
  });

  test('GET /workflows/:id existing', async () => {
    await request(app.getHttpServer())
      .get(`${'/workflows'}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
      });
  });

  test('POST /workflows existing resource', async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post('/workflows')
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      })
      .then(function () {
        void agent
          .post('/workflows')
          .send(CREATE_INPUT)
          .expect(HttpStatus.CONFLICT)
          .expect({
            statusCode: HttpStatus.CONFLICT,
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
