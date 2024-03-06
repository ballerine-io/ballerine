import request from 'supertest';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { INestApplication } from '@nestjs/common';
import { fetchServiceFromModule, initiateNestApp } from '@/test/helpers/nest-app-helper';
import { EndUserControllerExternal } from '@/end-user/end-user.controller.external';
import { faker } from '@faker-js/faker';
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
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { Customer, Project } from '@prisma/client';
import { createProject } from '@/test/helpers/create-project';
import { UserService } from '@/user/user.service';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { UserRepository } from '@/user/user.repository';
import { PasswordService } from '@/auth/password/password.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { ClsModule } from 'nestjs-cls';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { BusinessService } from '@/business/business.service';

describe('#EndUserControllerExternal', () => {
  let app: INestApplication;
  let endUserService: EndUserService;
  let project: Project;
  let customer: Customer;
  beforeAll(cleanupDatabase);
  afterEach(tearDownDatabase);

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
      BusinessService,
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
      UiDefinitionRepository,
      UiDefinitionService,
    ];
    endUserService = (await fetchServiceFromModule(EndUserService, servicesProviders, [
      PrismaModule,
    ])) as unknown as EndUserService;
    app = await initiateNestApp(
      app,
      [
        {
          provide: EndUserService,
          useValue: endUserService,
        },
        ...servicesProviders,
      ],
      [EndUserControllerExternal],
      [PrismaModule, ClsModule],
    );

    customer = await createCustomer(
      await app.get(PrismaService),
      faker.datatype.uuid(),
      'secret3',
      '',
      '',
      'webhook-shared-secret',
    );
    project = await createProject(await app.get(PrismaService), customer, '1');
  });

  describe('POST /end-user', () => {
    it('creates an end-user', async () => {
      expect(await endUserService.list({}, [project.id])).toHaveLength(0);

      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const response = await request(app.getHttpServer())
        .post('/external/end-users')
        .send({
          correlationId: faker.datatype.uuid(),
          endUserType: faker.random.word(),
          approvalState: 'APPROVED',
          firstName: 'test',
          lastName: 'lastName',
        })
        .set('authorization', `Bearer ${apiKey}`);

      if (response.status !== 201) {
        console.log(response.body);
      }

      expect(response.status).toBe(201);

      const createdUser = await endUserService.getById(response.body.id, {}, [project.id]);
      expect(createdUser).toMatchObject({
        firstName: 'test',
        lastName: 'lastName',
      });
    });
  });
});
