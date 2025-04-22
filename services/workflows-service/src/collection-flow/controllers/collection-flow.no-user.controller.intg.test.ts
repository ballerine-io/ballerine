import { INestApplication } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Project, WorkflowRuntimeDataToken } from '@prisma/client';
import { noop } from 'lodash';
import request from 'supertest';
import { ClsModule } from 'nestjs-cls';

import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { BusinessReportService } from '@/business-report/business-report.service';
import { MerchantMonitoringClient } from '@/merchant-monitoring/merchant-monitoring.client';
import { BusinessRepository } from '@/business/business.repository';
import { BusinessService } from '@/business/business.service';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { CustomerRepository } from '@/customer/customer.repository';
import { CustomerService } from '@/customer/customer.service';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { FileService } from '@/providers/file/file.service';
import { RiskRuleService } from '@/rule-engine/risk-rule.service';
import { RuleEngineService } from '@/rule-engine/rule-engine.service';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { SecretsManagerFactory } from '@/secrets-manager/secrets-manager.factory';
import { SentryService } from '@/sentry/sentry.service';
import { StorageService } from '@/storage/storage.service';
import { createProject } from '@/test/helpers/create-project';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { CollectionFlowNoUserController } from './collection-flow.no-user.controller';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { ApiKeyRepository } from '@/customer/api-key/api-key.repository';
import { AnalyticsService } from '@/common/analytics-logger/analytics.service';
import { WorkflowLogService } from '@/workflow/workflow-log.service';
import { WorkflowRuntimeDataActorService } from '@/workflow/workflow-runtime-data-actor.service';
import { mockClsService } from '@/test/helpers/cls-service-helper';

import { CollectionFlowStateService } from '../collection-flow-state.service';

describe('CollectionFlowSignupController', () => {
  let app: INestApplication;
  let prismaClient: PrismaService;
  let workflowTokenService: WorkflowTokenService;
  let workflowDefinitionRepository: WorkflowDefinitionRepository;
  let uiDefinitionRepository: UiDefinitionRepository;
  let workflowRuntimeDataRepository: WorkflowRuntimeDataRepository;
  let customerRepository: CustomerRepository;
  let endUserRepository: EndUserRepository;

  let project: Project;
  let workflowRuntimeDataToken: WorkflowRuntimeDataToken;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionFlowNoUserController],
      providers: [
        { provide: BusinessService, useValue: noop },
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
        { provide: AppLoggerService, useValue: { log: noop } },
        { provide: AnalyticsService, useValue: { log: noop } },
        { provide: WorkflowEventEmitterService, useValue: { emit: noop } },
        WorkflowService,
        EndUserService,
        UiDefinitionService,
        UiDefinitionRepository,
        CustomerService,
        ApiKeyService,
        ApiKeyRepository,
        BusinessReportService,
        BusinessRepository,
        EntityRepository,
        ProjectScopeService,
        PrismaService,
        WorkflowTokenRepository,
        CollectionFlowService,
        WorkflowTokenService,
        WorkflowDefinitionRepository,
        WorkflowRuntimeDataRepository,
        CustomerRepository,
        EndUserRepository,
        WorkflowLogService,
        WorkflowRuntimeDataActorService,
        mockClsService(),
        { provide: CollectionFlowStateService, useValue: noop },
      ],
      imports: [ClsModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prismaClient = module.get<PrismaService>(PrismaService);
    workflowTokenService = module.get<WorkflowTokenService>(WorkflowTokenService);
    workflowDefinitionRepository = module.get<WorkflowDefinitionRepository>(
      WorkflowDefinitionRepository,
    );
    uiDefinitionRepository = module.get<UiDefinitionRepository>(UiDefinitionRepository);
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

    await uiDefinitionRepository.create({
      data: {
        uiSchema: {},
        projectId: project.id,
        uiContext: 'collection_flow',
        name: 'signup-test-ui-definition',
        workflowDefinitionId: workflowDefinition.id,
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

  describe('POST /collection-flow/no-user', () => {
    it('should create a new EndUser and attach it to the WorkflowRuntimeDataToken', async () => {
      const signupDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.com',
      };

      expect(workflowRuntimeDataToken.endUserId).toBeNull();

      const response = await request(app.getHttpServer())
        .post('/collection-flow/no-user')
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

    // TODO: Uncomment once DB cleanup issue will be fixed

    // it('should create a new EndUser and set mainRepresentative in context', async () => {
    //   const signupDto = {
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'email@email.com',
    //   };

    //   await request(app.getHttpServer())
    //     .post('/collection-flow/no-user')
    //     .send(signupDto)
    //     .set('authorization', `Bearer ${workflowRuntimeDataToken.token}`);

    //   const workflowToken = await workflowTokenService.findByToken(workflowRuntimeDataToken.token);
    //   const endUser = await endUserRepository.findById(workflowToken?.endUserId ?? '', {}, [
    //     project.id,
    //   ]);

    //   const { body } = await request(app.getHttpServer())
    //     .get('/collection-flow/context')
    //     .set('authorization', `Bearer ${workflowRuntimeDataToken.token}`);

    //   const { context } = body;

    //   expect(get(context, 'entity.data.additionalInfo.mainRepresentative')).toEqual({
    //     ...signupDto,
    //     ballerineEntityId: endUser?.id,
    //   });
    //   expect(get(context, 'data.additionalInfo.mainRepresentative')).toEqual(signupDto);
    // });
  });
});
