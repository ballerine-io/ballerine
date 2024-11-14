import { noop } from 'lodash';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Project, WorkflowRuntimeDataToken } from '@prisma/client';

import { UserService } from '@/user/user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SentryService } from '@/sentry/sentry.service';
import { UserRepository } from '@/user/user.repository';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import { EndUserService } from '@/end-user/end-user.service';
import { createProject } from '@/test/helpers/create-project';
import { BusinessService } from '@/business/business.service';
import { CustomerService } from '@/customer/customer.service';
import { WorkflowService } from '@/workflow/workflow.service';
import { RiskRuleService } from '@/rule-engine/risk-rule.service';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { BusinessRepository } from '@/business/business.repository';
import { CustomerRepository } from '@/customer/customer.repository';
import { EntityRepository } from '@/common/entity/entity.repository';
import { RuleEngineService } from '@/rule-engine/rule-engine.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { BusinessReportService } from '@/business-report/business-report.service';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { SecretsManagerFactory } from '@/secrets-manager/secrets-manager.factory';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { CollectionFlowSignupController } from './collection-flow.signup.controller';
import { MerchantMonitoringClient } from '@/business-report/merchant-monitoring-client';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';

describe('CollectionFlowSignupController', () => {
  let app: INestApplication;
  let prismaClient: PrismaService;
  let workflowTokenService: WorkflowTokenService;
  let workflowDefinitionRepository: WorkflowDefinitionRepository;
  let workflowRuntimeDataRepository: WorkflowRuntimeDataRepository;
  let customerRepository: CustomerRepository;
  let endUserRepository: EndUserRepository;

  let project: Project;
  let workflowRuntimeDataToken: WorkflowRuntimeDataToken;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionFlowSignupController],
      providers: [
        { provide: AppLoggerService, useValue: noop },
        { provide: BusinessService, useValue: noop },
        { provide: UiDefinitionService, useValue: noop },
        { provide: CustomerService, useValue: noop },
        { provide: FileService, useValue: noop },
        { provide: SalesforceService, useValue: noop },
        { provide: RiskRuleService, useValue: noop },
        { provide: RuleEngineService, useValue: noop },
        { provide: SentryService, useValue: noop },
        { provide: SecretsManagerFactory, useValue: noop },
        { provide: StorageService, useValue: noop },
        { provide: MerchantMonitoringClient, useValue: noop },
        { provide: UserRepository, useValue: noop },
        { provide: UserService, useValue: noop },
        { provide: EventEmitter2, useValue: noop },
        WorkflowService,
        EndUserService,
        BusinessReportService,
        BusinessRepository,
        EntityRepository,
        ProjectScopeService,
        PrismaService,
        WorkflowTokenRepository,
        WorkflowEventEmitterService,
        CollectionFlowService,
        WorkflowTokenService,
        WorkflowDefinitionRepository,
        WorkflowRuntimeDataRepository,
        CustomerRepository,
        EndUserRepository,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prismaClient = module.get<PrismaService>(PrismaService);
    workflowTokenService = module.get<WorkflowTokenService>(WorkflowTokenService);
    workflowDefinitionRepository = module.get<WorkflowDefinitionRepository>(
      WorkflowDefinitionRepository,
    );
    workflowRuntimeDataRepository = module.get<WorkflowRuntimeDataRepository>(
      WorkflowRuntimeDataRepository,
    );
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    endUserRepository = module.get<EndUserRepository>(EndUserRepository);
  });

  beforeEach(async () => {
    await cleanupDatabase();

    const customer = await customerRepository.create({
      data: {
        name: 'signup-test-customer',
        displayName: 'Signup Test Customer',
        logoImageUri: 'test',
      },
    });

    project = await createProject(prismaClient, customer, 'signup-test-project');

    const workflowDefinition = await workflowDefinitionRepository.create({
      data: {
        name: 'signup-test-definition',
        projectId: project.id,
        definitionType: 'collectionFlow',
        definition: {},
      },
    });

    const { id: workflowRuntimeDataId } = await workflowRuntimeDataRepository.create({
      data: {
        workflowDefinitionId: workflowDefinition.id,
        projectId: project.id,
        workflowDefinitionVersion: 1,
        context: {},
      },
    });

    const now = new Date();
    const expiresAt = new Date(now.setDate(now.getDate() + 7));

    workflowRuntimeDataToken = await workflowTokenService.create(project.id, {
      workflowRuntimeDataId,
      expiresAt,
    });
  });

  afterAll(async () => {
    await tearDownDatabase();
    await app.close();
  });

  describe('POST /collection-flow/signup', () => {
    it('should create a new EndUser and attach it to the WorkflowRuntimeDataToken', async () => {
      const signupDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.com',
      };

      expect(workflowRuntimeDataToken.endUserId).toBeNull();

      const response = await request(app.getHttpServer())
        .post('/collection-flow/signup')
        .send(signupDto)
        .set('authorization', `Bearer ${workflowRuntimeDataToken.token}`);

      expect(response.status).toBe(201);

      const workflowToken = await workflowTokenService.findByToken(workflowRuntimeDataToken.token);
      expect(workflowToken?.endUserId).toBeDefined();

      const endUser = await endUserRepository.findById(workflowToken?.endUserId ?? '', {}, [
        project.id,
      ]);
      expect(endUser).toBeDefined();
    });
  });
});
