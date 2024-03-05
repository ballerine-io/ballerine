import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler, ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
// import { ACGuard } from 'nest-access-control';
import { ACLModule } from '@/common/access-control/acl.module';
// import { AclFilterResponseInterceptor } from '@/common/access-control/interceptors/acl-filter-response.interceptor';
// import { AclValidateRequestInterceptor } from '@/common/access-control/interceptors/acl-validate-request.interceptor';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowService } from './workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowDefinition, WorkflowRuntimeData } from '@prisma/client';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { EndUserService } from '@/end-user/end-user.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { PrismaService } from '@/prisma/prisma.service';
import { WinstonLogger } from '@/common/utils/winston-logger/winston-logger';
// import { AclFilterResponseInterceptor } from '@/common/access-control/interceptors/acl-filter-response.interceptor';

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

describe('Workflow (external)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let wfService: WorkflowService;

  beforeEach(async () => {
    wfService = {
      listRuntimeData: jest.fn() as unknown,
      getWorkflowRuntimeDataById: jest.fn() as unknown,
      getWorkflowDefinitionById: jest.fn() as unknown,
    } as WorkflowService;

    moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: WorkflowService,
          useValue: wfService,
        },
        {
          provide: EventEmitter2,
          useValue: {} as EventEmitter2,
        },
        {
          provide: HookCallbackHandlerService,
          useValue: {} as HookCallbackHandlerService,
        },
        {
          provide: WorkflowDefinitionService,
          useValue: {} as WorkflowDefinitionService,
        },
        {
          provide: EndUserService,
          useValue: {} as EndUserService,
        },
        {
          provide: WorkflowTokenService,
          useValue: {} as WorkflowTokenService,
        },
        {
          provide: 'LOGGER',
          useClass: WinstonLogger,
        },
        {
          provide: PrismaService,
          useValue: {} as PrismaService,
        },
      ],
      controllers: [WorkflowControllerExternal],
      imports: [ACLModule],
    })
      // .overrideGuard(ACGuard)
      // .useValue(acGuard)
      // .overrideInterceptor(AclFilterResponseInterceptor)
      // .useValue(aclFilterResponseInterceptor)
      // .overrideInterceptor(AclValidateRequestInterceptor)
      // .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();

    app.use((req, res, next) => {
      req.user = {
        // @ts-ignore
        type: 'customer',
      };
      next();
    });

    await app.init();
  });

  // test('GET /workflows will return a two-key object containing "definition" and "runtime data"  ', async () => {
  //   const wfService = moduleRef.get<WorkflowService>(WorkflowService);
  //   (wfService.listRuntimeData as jest.Mock).mockReturnValue(
  //     Promise.resolve([
  //       {
  //         workflowDefinition: { id: 'a' },
  //         state: { id: 'b' } as unknown,
  //       },
  //     ] as unknown as CompleteWorkflowData[]),
  //   );

  //   await request(app.getHttpServer())
  //     .get('/external/workflows')
  //     .expect(HttpStatus.OK)
  //     .expect([
  //       {
  //         workflowDefinition: { id: 'a' },
  //         workflowRuntimeData: {
  //           state: { id: 'b' },
  //         },
  //       },
  //     ]);
  // });

  test('GET /workflows/:id non existing', async () => {
    const wfService = moduleRef.get<WorkflowService>(WorkflowService);
    (wfService.getWorkflowRuntimeDataById as jest.Mock).mockReturnValue(Promise.resolve(undefined));

    await request(app.getHttpServer())
      .get(`/external/workflows/abcde`)
      .set('authorization', 'Bearer secret')
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: 404,
        message: 'No resource with id [abcde] was found',
        error: 'Not Found',
      });
  });

  test('GET /workflows/:id existing', async () => {
    const wfService = moduleRef.get<WorkflowService>(WorkflowService);

    (wfService.getWorkflowRuntimeDataById as jest.Mock).mockReturnValue(
      Promise.resolve({
        state: { id: 'b' } as unknown,
      } as unknown as WorkflowRuntimeData),
    );
    (wfService.getWorkflowDefinitionById as jest.Mock).mockReturnValue(
      Promise.resolve({ id: 'a' } as unknown as WorkflowDefinition),
    );
    await request(app.getHttpServer())
      .get(`${'/external/workflows'}/abcde`)
      .set('authorization', 'Bearer secret')
      .expect(HttpStatus.OK)
      .expect({
        workflowDefinition: { id: 'a' },
        workflowRuntimeData: { state: { id: 'b' } },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
