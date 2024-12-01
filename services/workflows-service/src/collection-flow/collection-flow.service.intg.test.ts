import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { BusinessReportService } from '@/business-report/business-report.service';
import { BusinessRepository } from '@/business/business.repository';
import { BusinessService } from '@/business/business.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { CustomerRepository } from '@/customer/customer.repository';
import { CustomerService } from '@/customer/customer.service';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
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
import { cleanupDatabase } from '@/test/helpers/database-helper';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UserService } from '@/user/user.service';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Customer, EndUser, PrismaClient, Project } from '@prisma/client';
import { noop } from 'lodash';
import { CollectionFlowService } from './collection-flow.service';
import { MerchantMonitoringClient } from '@/business-report/merchant-monitoring-client';

const deps: Provider[] = [
  {
    provide: AppLoggerService,
    useValue: noop,
  },
  {
    provide: EndUserService,
    useValue: noop,
  },
  {
    provide: BusinessReportService,
    useValue: noop,
  },
  {
    provide: BusinessRepository,
    useValue: noop,
  },
  {
    provide: BusinessService,
    useValue: noop,
  },
  {
    provide: EntityRepository,
    useValue: noop,
  },
  {
    provide: FileService,
    useValue: noop,
  },
  {
    provide: WorkflowEventEmitterService,
    useValue: noop,
  },
  {
    provide: UserService,
    useValue: noop,
  },
  {
    provide: SalesforceService,
    useValue: noop,
  },
  {
    provide: RiskRuleService,
    useValue: noop,
  },
  {
    provide: RuleEngineService,
    useValue: noop,
  },
  {
    provide: SentryService,
    useValue: noop,
  },
  {
    provide: SecretsManagerFactory,
    useValue: noop,
  },
  {
    provide: StorageService,
    useValue: noop,
  },
  {
    provide: FilterRepository,
    useValue: noop,
  },
  {
    provide: FilterService,
    useValue: noop,
  },
  {
    provide: ApiKeyService,
    useValue: noop,
  },
];

describe('CollectionFlowService', () => {
  let prismaClient: PrismaClient;
  let collectionFlowService: CollectionFlowService;
  let workflowTokenService: WorkflowTokenService;
  let workflowDefinitionRepository: WorkflowDefinitionRepository;
  let workflowRuntimeDataRepository: WorkflowRuntimeDataRepository;
  let customerRepository: CustomerRepository;
  let endUserRepository: EndUserRepository;

  let customer: Customer;
  let project: Project;
  let endUser: EndUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...deps,
        WorkflowDefinitionRepository,
        PrismaService,
        ProjectScopeService,
        WorkflowRuntimeDataRepository,
        WorkflowService,
        WorkflowTokenRepository,
        WorkflowTokenService,
        UiDefinitionRepository,
        UiDefinitionService,
        CollectionFlowService,
        WorkflowDefinitionService,
        CustomerRepository,
        CustomerService,
        EndUserRepository,
        MerchantMonitoringClient,
      ],
    }).compile();

    prismaClient = module.get<PrismaService>(PrismaService);
    collectionFlowService = module.get<CollectionFlowService>(CollectionFlowService);
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

    customer = await customerRepository.create({
      data: {
        name: 'collection-flow-test-customer',
        displayName: 'Collection Flow Test Customer',
        logoImageUri: 'test',
      },
    });

    project = await createProject(prismaClient, customer, 'collection-flow-test-project');

    endUser = await endUserRepository.create({
      data: {
        projectId: project.id,
        firstName: 'test',
        lastName: 'test',
      },
    });
  });

  describe('getCollectionFlowContext', () => {
    it('should return context and config', async () => {
      const workflowContext = {
        collectionFlow: {},
      };

      const workflowConfig = {
        someParam: '123',
      };

      const workflowDefinition = await workflowDefinitionRepository.create({
        data: {
          definitionType: 'statechart-json',
          name: 'test',
          definition: {},
          projectId: project.id,
        },
      });

      const workflowRuntimeData = await workflowRuntimeDataRepository.create({
        data: {
          workflowDefinitionId: workflowDefinition.id,
          workflowDefinitionVersion: workflowDefinition.version,
          projectId: project.id,
          context: workflowContext,
          config: workflowConfig,
        },
      });

      const token = await workflowTokenService.create(project.id, {
        workflowRuntimeDataId: workflowRuntimeData.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        endUserId: endUser.id,
      });

      const context = await collectionFlowService.getCollectionFlowContext(token);

      expect(context.context).toEqual(workflowContext);
      expect(context.config).toEqual(workflowConfig);
    });
  });
});
