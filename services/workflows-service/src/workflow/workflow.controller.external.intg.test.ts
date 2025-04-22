import request from 'supertest';
import { Request } from 'express';
import { INestApplication } from '@nestjs/common';
import { Business, Project, User } from '@prisma/client';

import { UserService } from '@/user/user.service';
import { AlertService } from '@/alert/alert.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { FilterService } from '@/filter/filter.service';
import { NotionService } from '@/notion/notion.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SentryService } from '@/sentry/sentry.service';
import { UserRepository } from '@/user/user.repository';
import { StorageService } from '@/storage/storage.service';
import { AlertRepository } from '@/alert/alert.repository';
import { FileService } from '@/providers/file/file.service';
import { EndUserService } from '@/end-user/end-user.service';
import { FileRepository } from '@/storage/storage.repository';
import { BusinessService } from '@/business/business.service';
import { FilterRepository } from '@/filter/filter.repository';
import { createProject } from '@/test/helpers/create-project';
import { WorkflowService } from '@/workflow/workflow.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { RiskRuleService } from '@/rule-engine/risk-rule.service';
import { PasswordService } from '@/auth/password/password.service';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { BusinessRepository } from '@/business/business.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { RuleEngineService } from '@/rule-engine/rule-engine.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { BusinessReportService } from '@/business-report/business-report.service';
import { SecretsManagerFactory } from '@/secrets-manager/secrets-manager.factory';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowControllerExternal } from '@/workflow/workflow.controller.external';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { DataInvestigationService } from '@/data-analytics/data-investigation.service';
import { MerchantMonitoringClient } from '@/merchant-monitoring/merchant-monitoring.client';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { fetchServiceFromModule, initiateNestApp } from '@/test/helpers/nest-app-helper';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowLogService } from '@/workflow/workflow-log.service';

describe('/api/v1/external/workflows #api #integration', () => {
  let app: INestApplication;

  let assignee: User;
  let project: Project;
  let business: Business;

  const API_KEY = 'secret';
  const WORKFLOW_ID = 'workflow-id';

  afterEach(tearDownDatabase);

  beforeAll(async () => {
    await cleanupDatabase();

    const servicesProviders = [
      FileService,
      UserService,
      AlertService,
      FilterService,
      NotionService,
      PrismaService,
      SentryService,
      EndUserService,
      FileRepository,
      StorageService,
      UserRepository,
      AlertRepository,
      BusinessService,
      PasswordService,
      RiskRuleService,
      WorkflowService,
      EntityRepository,
      FilterRepository,
      EndUserRepository,
      RuleEngineService,
      SalesforceService,
      BusinessRepository,
      ProjectScopeService,
      UiDefinitionService,
      DataAnalyticsService,
      WorkflowTokenService,
      BusinessReportService,
      SecretsManagerFactory,
      UiDefinitionRepository,
      WorkflowTokenRepository,
      DataInvestigationService,
      MerchantMonitoringClient,
      AlertDefinitionRepository,
      WorkflowDefinitionService,
      HookCallbackHandlerService,
      WorkflowEventEmitterService,
      WorkflowDefinitionRepository,
      WorkflowRuntimeDataRepository,
      SalesforceIntegrationRepository,
      WorkflowLogService,
    ];

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
      servicesProviders,
      [WorkflowControllerExternal],
      [PrismaModule],
      [userAuthOverrideMiddleware],
    );

    const workflowDefinitionRepository = (await fetchServiceFromModule(
      WorkflowDefinitionRepository,
      servicesProviders,
      [PrismaModule],
    )) as unknown as WorkflowDefinitionRepository;

    const businessRepository = (await fetchServiceFromModule(
      BusinessRepository,
      servicesProviders,
      [PrismaModule],
    )) as unknown as BusinessRepository;

    const customer = await createCustomer(
      await app.get(PrismaService),
      String(Date.now()),
      API_KEY,
      '',
      '',
      'webhook-shared-secret',
    );

    project = await createProject(await app.get(PrismaService), customer, '4');

    business = await businessRepository.create({
      data: {
        companyName: 'Test Company',
        project: {
          connect: {
            id: project.id,
          },
        },
      },
    });

    await workflowDefinitionRepository.create({
      data: {
        id: WORKFLOW_ID,
        name: 'workflow-name',
        definitionType: 'statechart-json',
        definition: {},
        project: {
          connect: {
            id: project.id,
          },
        },
      },
    });
  });

  describe('when unauthenticated', () => {
    it('should return 401 when not recieving authorization token', async () => {
      // Arrange

      // Act
      const res = await request(app.getHttpServer()).post('/external/workflows/run').send({});

      // Assert
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 when API key is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/external/workflows/run')
        .set('authorization', 'Bearer INVALID_API_KEY')
        .send({
          workflowDefinitionId: 'test-id',
          context: { entityId: 'test-entity' },
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('when authenticated', () => {
    describe('POST /run', () => {
      describe('workflow should not be created', () => {
        it('should return 400 when there is no context', async () => {
          // Arrange
          const data = {};

          // Act
          const res = await request(app.getHttpServer())
            .post('/external/workflows/run')
            .set('authorization', `Bearer ${API_KEY}`)
            .send(data);

          // Assert
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toEqual('Context is required');
        });

        it('should return 400 when there is no entity in context', async () => {
          // Arrange
          const data = { context: {} };

          // Act
          const res = await request(app.getHttpServer())
            .post('/external/workflows/run')
            .set('authorization', `Bearer ${API_KEY}`)
            .send(data);

          // Assert
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toEqual('Entity id is required');
        });

        it('should return 400 when there is no workflowId in the payload', async () => {
          // Arrange
          const data = {
            context: { entity: { id: 'some-entity' } },
          };

          // Act
          const res = await request(app.getHttpServer())
            .post('/external/workflows/run')
            .set('authorization', `Bearer ${API_KEY}`)
            .send(data);

          // Assert
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toContain('Workflow id is required');
        });

        it('should return 400 when the provided workflowId does not exist in the DB', async () => {
          // Arrange
          const workflowId = 'NON_EXISTANT_WORKFLOW_ID';
          const data = {
            workflowId,
            context: { entity: { id: 'some-entity' } },
          };

          // Act
          const res = await request(app.getHttpServer())
            .post('/external/workflows/run')
            .set('authorization', `Bearer ${API_KEY}`)
            .send(data);

          // Assert
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toContain(`Workflow Definition ${workflowId} was not found`);
        });

        it('should return 400 when there is no entity data in the payload', async () => {
          // Arrange
          const data = {
            workflowId: WORKFLOW_ID,
            context: { entity: { id: 'some-entity' } },
          };

          // Act
          const res = await request(app.getHttpServer())
            .post('/external/workflows/run')
            .set('authorization', `Bearer ${API_KEY}`)
            .send(data);

          // Assert
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toEqual('Entity data is required');
        });
      });

      describe('workflow should be created', () => {
        it('should return 200 when workflow is successfully created', async () => {
          // Arrange
          const data = {
            workflowId: WORKFLOW_ID,
            context: {
              entity: {
                id: 'some-entity',
                type: 'business',
                data: { ballerineEntityId: business.id },
              },
            },
          };

          // Act
          const res = await request(app.getHttpServer())
            .post('/external/workflows/run')
            .set('authorization', `Bearer ${API_KEY}`)
            .send(data);

          // Assert
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject({
            workflowDefinitionId: WORKFLOW_ID,
            workflowRuntimeId: expect.any(String),
            ballerineEntityId: business.id,
            entities: [],
          });
        });
      });
    });
  });
});
