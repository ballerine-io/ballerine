import request from 'supertest';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { INestApplication } from '@nestjs/common';
import { fetchServiceFromModule, initiateNestApp } from '@/test/helpers/nest-app-helper';
import { faker } from '@faker-js/faker';
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
import { CustomerService } from './customer.service';
import { CustomerControllerExternal } from './customer.controller.external';
import { CustomerRepository } from './customer.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { AllExceptionsFilter } from '@/common/filters/AllExceptions.filter';

describe.skip('#CustomerControllerExternal', () => {
  let app: INestApplication;
  let customerService: CustomerService;
  let project: Project;
  let customer: Customer;
  beforeAll(cleanupDatabase);
  afterEach(tearDownDatabase);

  beforeAll(async () => {
    // await cleanupDatabase();

    const servicesProviders = [
      AllExceptionsFilter,
      CustomerService,
      CustomerRepository,
      EndUserService,
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
      UiDefinitionRepository,
      UiDefinitionService,
    ];
    customerService = (await fetchServiceFromModule(CustomerService, servicesProviders, [
      PrismaModule,
    ])) as unknown as CustomerService;
    app = await initiateNestApp(
      app,
      [
        {
          provide: CustomerService,
          useValue: customerService,
        },
        ...servicesProviders,
      ],
      [CustomerControllerExternal],
      [PrismaModule, ClsModule],
    );
  });

  describe('POST /subscriptions', () => {
    beforeEach(async () => {
      const prismaClient = app.get(PrismaService);

      customer = await createCustomer(
        prismaClient,
        faker.datatype.uuid(),
        'secret3',
        '',
        '',
        'webhook-shared-secret',
      );

      project = await createProject(prismaClient, customer, faker.datatype.uuid());

      const dbCustomer = await customerService.getById(customer.id);

      const customerId = customer.id.replace('customer-', '');
      expect(dbCustomer).toMatchObject({
        id: customer.id,
        country: 'GB',
        displayName: `Customer ${customerId}`,
        faviconImageUri: '',
        language: 'en',
        logoImageUri: '',
        name: `Customer ${customerId}`,
        subscriptions: null,
        websiteUrl: null,
      });
    });

    it('creates a subsriptions for customer', async () => {
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const payload = {
        subscriptions: [
          {
            url: faker.internet.url(),
            events: ['aaa'],
            type: 'webhook',
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/external/customers/subscriptions')
        .send(payload)
        .set('authorization', `Bearer ${apiKey}`);

      expect(response.status).toBe(201);

      const dbCustomer = await customerService.getById(customer.id);
      expect(dbCustomer.subscriptions).toMatchObject(payload.subscriptions);
    });

    it('subsriptions has to be valid url', async () => {
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const payload = {
        subscriptions: [
          {
            url: 'non-url',
            events: ['bbb'],
            type: 'webhook',
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/external/customers/subscriptions')
        .send(payload)
        .set('authorization', `Bearer ${apiKey}`);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            message: 'Invalid url',
            path: 'subscriptions.0.url',
          },
        ],
        message: 'Validation error',
        statusCode: 400,
      });
      const dbCustomer = await customerService.getByProjectId(project.id);

      expect(dbCustomer.subscriptions).toBe(null);
    });
  });
});
