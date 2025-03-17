import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { FilterService } from '@/filter/filter.service';
import { CustomerService } from '@/customer/customer.service';
import { PrismaService } from '@/prisma/prisma.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { Project } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';
import { FilterRepository } from '@/filter/filter.repository';
import { CustomerRepository } from '@/customer/customer.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WinstonLogger } from '@/common/utils/winston-logger/winston-logger';
import { ClsService } from 'nestjs-cls';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { ApiKeyRepository } from '@/customer/api-key/api-key.repository';
import { MerchantMonitoringModule } from '@/merchant-monitoring/merchant-monitoring.module';
import { AnalyticsService } from '@/common/analytics-logger/analytics.service';

const buildWorkflowDefinition = (sequenceNum: number, projectId?: string, isPublic = false) => {
  return {
    id: sequenceNum.toString(),
    name: `name ${sequenceNum}`,
    version: sequenceNum,
    definition: {
      initial: 'initial',
      states: {
        initial: {
          on: {
            COMPLETE: 'completed',
          },
        },
        completed: {
          type: 'final',
        },
      },
    },
    definitionType: `definitionType ${sequenceNum}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    contextSchema: {
      type: 'json-schema',
      schema: {},
    },
    projectId: projectId,
    isPublic: isPublic,
  };
};

describe('WorkflowDefinitionService', () => {
  let workflowDefinitionService: WorkflowDefinitionService;
  let filterService: FilterService;
  let prismaService: PrismaService;
  let project: Project;
  let differentProject: Project;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MerchantMonitoringModule],
      providers: [
        WorkflowDefinitionService,
        FilterRepository,
        WorkflowDefinitionRepository,
        CustomerRepository,
        ApiKeyService,
        ApiKeyRepository,
        { useClass: WinstonLogger, provide: 'LOGGER' },
        ClsService,
        AppLoggerService,
        AnalyticsService,
        FilterService,
        ProjectScopeService,
        CustomerService,
        PrismaService, // Assumes PrismaService is configured to connect to your test database
      ],
    }).compile();

    workflowDefinitionService = module.get<WorkflowDefinitionService>(WorkflowDefinitionService);
    filterService = module.get<FilterService>(FilterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.workflowDefinition.create({
      data: buildWorkflowDefinition(Math.floor(Math.random() * 1000) + 1),
    });

    const customer = await createCustomer(
      prismaService,
      String(Date.now()),
      'secret',
      '',
      '',
      'webhookSharedSecret',
    );
    project = await createProject(prismaService, customer, '3');
    differentProject = await createProject(prismaService, customer, '4');
  });

  describe('#upgradeDefinitionVersion', () => {
    it('should generate a new definition with the new version and update only the relevant filters', async () => {
      // Arrange
      const workflowDefintion = await prismaService.workflowDefinition.create({
        data: buildWorkflowDefinition(2, project.id),
      });
      const { id, definition } = workflowDefintion;

      const updateArgs = {
        definition: definition,
        config: {
          workflowLevelResolution: true,
        },
        extensions: {
          apiPlugins: [
            {
              name: 'website_monitoring',
              pluginKind: 'api',
              url: `{secret.UNIFIED_API_URL}/website-monitoring`,
              method: 'POST',
              stateNames: ['start_website_monitoring'],
              successAction: 'COMPLETE',
              errorAction: 'COMPLETE',
              headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
              request: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `{
              businessId: entity.ballerineEntityId || entity.data.id,
              websiteUrl: entity.data.additionalInfo.store.website.mainWebsite,
              countryCode: entity.data.country,
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/WEBSITE_MONITORING_FINISHED','?resultDestination=pluginsOutput.website_monitoring.data']),
              vendor: 'legitscript'
              }`, // jmespath
                  },
                ],
              },
              response: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: '{metadata: {result: @}}', // jmespath
                  },
                ],
              },
            },
          ],
        },
      };

      const filter1 = await prismaService.filter.create({
        data: {
          entity: 'individual',
          name: 'someName',
          query: {
            where: {
              workflowDefinitionId: id,
            },
          },
          projectId: project.id,
        } as any,
      });

      const filter2 = await prismaService.filter.create({
        data: {
          entity: 'individual',
          name: 'someName2',
          query: {
            where: {
              workflowDefinitionId: { in: [id, 'some other id'] },
            },
          },
          projectId: project.id,
        } as any,
      });

      const otherProjectFilter = await prismaService.filter.create({
        data: {
          entity: 'individual',
          name: 'someName3',
          query: {
            where: {
              workflowDefinitionId: { in: [id, 'some other id'] },
            },
          },
          projectId: differentProject.id,
        } as any,
      });

      const otherDefintionFilter = await prismaService.filter.create({
        data: {
          entity: 'individual',
          name: 'someName3',
          query: {
            where: {
              workflowDefinitionId: { in: ['some other id'] },
            },
          },
          projectId: project.id,
        } as any,
      });

      // Act
      const updatedWorkflowDefintiion = await workflowDefinitionService.upgradeDefinitionVersion(
        id,
        updateArgs as Parameters<WorkflowDefinitionService['upgradeDefinitionVersion']>[1],
        project.id,
      );

      // Assert
      const updatedFilter1 = await filterService.getById(filter1.id, {}, [project.id]);
      const updatedFilter2 = await filterService.getById(filter2.id, {}, [project.id]);
      const otherProjectId = await filterService.getById(otherProjectFilter.id, {}, [
        otherProjectFilter.projectId,
      ]);
      const otherWorkflowFilter = await filterService.getById(otherDefintionFilter.id, {}, [
        otherDefintionFilter.projectId,
      ]);

      // @ts-ignore
      expect(updatedFilter1.query.where.workflowDefinitionId).toEqual({
        in: [id, updatedWorkflowDefintiion.id],
      });

      // @ts-ignore
      expect(updatedFilter2.query.where.workflowDefinitionId).toEqual({
        // @ts-ignore
        in: filter2.query.where.workflowDefinitionId.in.concat([updatedWorkflowDefintiion.id]),
      });

      // @ts-ignore
      expect(otherProjectId.query.where).toEqual(otherProjectId.query.where);

      // @ts-ignore
      expect(otherWorkflowFilter.query.where).toEqual(otherWorkflowFilter.query.where);

      const latestWorkflowVersion = await workflowDefinitionService.getLatestVersion(id, [
        project.id,
      ]);

      expect(latestWorkflowVersion.id).toEqual(updatedWorkflowDefintiion.id);
    });
  });

  describe('Public records (templates)', () => {
    it('should not allow editing of public records', async () => {
      // Arrange
      const publicWorkflowDefinition = await prismaService.workflowDefinition.create({
        data: buildWorkflowDefinition(11, undefined, true),
      });

      const updateArgs = {
        definition: { some: 'new definition' },
      };

      // Act & Assert
      await expect(
        workflowDefinitionService.updateById(publicWorkflowDefinition.id, updateArgs as any, [
          project.id,
        ]),
      ).rejects.toThrow('Cannot update public workflow definition templates');
    });

    it('should allow reading of public records', async () => {
      // Arrange
      const publicWorkflowDefinition = await prismaService.workflowDefinition.create({
        data: buildWorkflowDefinition(23, undefined, true),
      });

      // Act
      const result = await workflowDefinitionService.getLatestVersion(publicWorkflowDefinition.id, [
        project.id,
      ]);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toEqual(publicWorkflowDefinition.id);
      expect(result.isPublic).toBe(true);
    });
  });
});
