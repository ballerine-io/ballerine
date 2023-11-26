import request from 'supertest';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { INestApplication } from '@nestjs/common';
import { fetchServiceFromModule, initiateNestApp } from '@/test/helpers/nest-app-helper';
import { EndUserService } from '@/end-user/end-user.service';
import { PrismaModule } from 'nestjs-prisma';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { FileRepository } from '@/storage/storage.repository';
import { FileService } from '@/providers/file/file.service';
import { StorageService } from '@/storage/storage.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { BusinessRepository } from '@/business/business.repository';
import { WorkflowDefinitionRepository } from '@/workflow/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { PrismaClient, Project, User } from '@prisma/client';
import { createProject } from '@/test/helpers/create-project';
import { UserService } from '@/user/user.service';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { UserRepository } from '@/user/user.repository';
import { PasswordService } from '@/auth/password/password.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowControllerInternal } from '@/workflow/workflow.controller.internal';
import { Request } from 'express';

describe('/api/v1/internal/workflows #api #integration', () => {
  let app: INestApplication;
  let workflowService: WorkflowService;
  let project: Project;
  let assignee: User;
  const db = new PrismaClient();

  beforeAll(cleanupDatabase);
  afterEach(tearDownDatabase);
  const TEST_USER_ID = 'test-user1321321';

  beforeAll(async () => {
    await cleanupDatabase();

    const servicesProviders = [
      EndUserRepository,
      EntityRepository,
      FilterService,
      ProjectScopeService,
      FilterRepository,
      FileRepository,
      FileService,
      StorageService,
      WorkflowEventEmitterService,
      BusinessRepository,
      WorkflowDefinitionRepository,
      WorkflowRuntimeDataRepository,
      WorkflowService,
      EventEmitter2,
      PrismaService,
      UserService,
      UserRepository,
      SalesforceService,
      SalesforceIntegrationRepository,
      PasswordService,
      WorkflowTokenService,
      WorkflowTokenRepository,
      WorkflowRuntimeDataRepository,
      EndUserService,
    ];
    workflowService = (await fetchServiceFromModule(WorkflowService, servicesProviders, [
      PrismaModule,
    ])) as unknown as WorkflowService;
    const userAuthOverrideMiddleware = (req: Request, res: any, next: any) => {
      req.user = {
        // @ts-ignore
        user: assignee,
        type: 'user',
        projectIds: [project.id],
      };
      next();
    };
    app = await initiateNestApp(
      app,
      [
        {
          provide: WorkflowService,
          useValue: workflowService,
        },
        ...servicesProviders,
      ],
      [WorkflowControllerInternal],
      [PrismaModule],
      [userAuthOverrideMiddleware],
    );

    const customer = await createCustomer(
      await app.get(PrismaService),
      String(Date.now()),
      'secret',
      '',
      '',
      'webhook-shared-secret',
    );
    project = await createProject(await app.get(PrismaService), customer, '1');
  });

  describe('PATCH /:id/decision/:documentId', () => {
    describe("when updating a document's decision", () => {
      it('should not update the rest of the context', async () => {
        // Arrange
        const createWorkflowDefinitionPayload = {
          data: {
            name: 'test',
            definitionType: 'statechart-json',
            definition: {},
            isPublic: true,
          },
        } satisfies Parameters<(typeof db)['workflowDefinition']['create']>[0];
        const createWorkflowPayload = {
          data: {
            workflowDefinitionVersion: 1,
            workflowDefinitionId: 'test',
            context: {
              documents: [
                {
                  id: 'test1',
                  category: 'test',
                  type: 'test',
                  issuer: {
                    country: 'GH',
                  },
                  pages: [
                    {
                      provider: 'http',
                      type: 'png',
                      uri: 'test',
                    },
                  ],
                  properties: {},
                },
              ],
            },
            projectId: project.id,
          },
        } satisfies Parameters<(typeof db)['workflowRuntimeData']['create']>[0];
        const createUserPayload = {
          data: {
            id: TEST_USER_ID,
            email: 'test@test.com',
            password: 'test',
            firstName: 'test',
            lastName: 'test',
            roles: ['user'],
            userToProjects: {
              create: {
                projectId: project.id,
              },
            },
          },
        } satisfies Parameters<(typeof db)['user']['create']>[0];
        const workflowDefinition = await db.workflowDefinition.create(
          createWorkflowDefinitionPayload,
        );
        assignee = await db.user.create(createUserPayload);
        const workflow = await db.workflowRuntimeData.create({
          ...createWorkflowPayload,
          data: {
            ...createWorkflowPayload.data,
            assigneeId: assignee.id,
            workflowDefinitionId: workflowDefinition.id,
          },
        });
        const ENDPOINT = `/internal/workflows/${workflow.id}/decision/${
          // @ts-ignore
          workflow.context.documents[0].id as string
        }`;
        const requestPayload = {
          decision: 'approve',
        };

        const res = await request(app.getHttpServer())
          .patch(ENDPOINT)
          .send(requestPayload)
          .expect(200);
        const { context: updatedContext } = await db.workflowRuntimeData.findUniqueOrThrow({
          where: {
            id: workflow.id,
          },
        });

        // Assert
        expect(updatedContext).toMatchObject({
          ...(workflow.context as Record<string, unknown>),
          documents: [
            {
              // @ts-ignore
              ...workflow.context.documents[0],
              decision: {
                status: 'approved',
                rejectionReason: null,
              },
            },
          ],
        });
      });
    });
  });
});
