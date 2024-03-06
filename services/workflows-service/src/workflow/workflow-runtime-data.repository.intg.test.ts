import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { fetchServiceFromModule } from '@/test/helpers/nest-app-helper';
import { PrismaModule } from 'nestjs-prisma';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { FileRepository } from '@/storage/storage.repository';
import { FileService } from '@/providers/file/file.service';
import { StorageService } from '@/storage/storage.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { BusinessRepository } from '@/business/business.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { EndUserService } from '@/end-user/end-user.service';
import { Project } from '@prisma/client';
import { createCustomer } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { UserService } from '@/user/user.service';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { UserRepository } from '@/user/user.repository';
import { PasswordService } from '@/auth/password/password.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { faker } from '@faker-js/faker';
import { BusinessService } from '@/business/business.service';

describe('#Workflow Runtime Repository Integration Tests', () => {
  let workflowRuntimeRepository: WorkflowRuntimeDataRepository;
  let userRepository: UserRepository;
  let workflowDefinitionRepository: WorkflowDefinitionRepository;
  let project: Project;

  beforeAll(async () => {
    await cleanupDatabase();

    const servicesProviders = [
      EndUserRepository,
      EndUserService,
      FilterService,
      FilterRepository,
      ProjectScopeService,
      FileRepository,
      FileService,
      StorageService,
      WorkflowEventEmitterService,
      BusinessRepository,
      BusinessService,
      WorkflowDefinitionRepository,
      WorkflowService,
      EventEmitter2,
      PrismaService,
      EntityRepository,
      UserService,
      UserRepository,
      SalesforceService,
      SalesforceIntegrationRepository,
      PasswordService,
      WorkflowTokenService,
      WorkflowTokenRepository,
      WorkflowRuntimeDataRepository,
      UiDefinitionService,
      UiDefinitionRepository,
    ];

    workflowRuntimeRepository = (await fetchServiceFromModule(
      WorkflowRuntimeDataRepository,
      servicesProviders,
      [PrismaModule],
    )) as unknown as WorkflowRuntimeDataRepository;

    workflowDefinitionRepository = (await fetchServiceFromModule(
      WorkflowDefinitionRepository,
      servicesProviders,
      [PrismaModule],
    )) as unknown as WorkflowDefinitionRepository;

    userRepository = (await fetchServiceFromModule(UserRepository, servicesProviders, [
      PrismaModule,
    ])) as unknown as UserRepository;

    const prismaService = (await fetchServiceFromModule(PrismaService, servicesProviders, [
      PrismaModule,
    ])) as unknown as PrismaService;

    const customer = await createCustomer(
      prismaService,
      faker.datatype.uuid(),
      'secret',
      '',
      '',
      'webhook-shared-secret',
    );
    project = await createProject(prismaService, customer, '5');

    await workflowDefinitionRepository.create({
      data: {
        id: 'test-definition',
        name: 'test',
        version: 1,
        definitionType: 'statechart-json',
        definition: {
          id: 'Manual Review',
        },
      },
    });
  });

  afterAll(async () => {
    await cleanupDatabase();
    await tearDownDatabase();
  });

  describe('updateById', () => {
    describe('when updating workflow but not its context', () => {
      it('should not result in empty context', async () => {
        // Arrange
        const userPayload = {
          data: {
            id: '1',
            email: 'test2@test.com',
            firstName: 'Test',
            lastName: 'User',
            password: 'test',
            roles: ['customer'],
            userToProjects: {
              create: {
                projectId: project.id,
              },
            },
          },
        } satisfies Parameters<(typeof userRepository)['create']>[0];
        const createPayload = {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: {
              entity: {
                id: '1',
                name: 'Test Entity',
              },
              documents: [
                {
                  id: 'file1',
                },
                {
                  id: 'file2',
                },
              ],
            },
            projectId: project.id,
          },
        } satisfies Parameters<(typeof workflowRuntimeRepository)['create']>[0];
        const updatePayload = {
          data: {
            assigneeId: userPayload.data.id,
            assignedAt: new Date(),
          },
        } satisfies Parameters<(typeof workflowRuntimeRepository)['updateById']>[1];
        const workflow = await workflowRuntimeRepository.create(createPayload);
        await userRepository.create(userPayload, project.id);

        // Act
        const updatedWorkflow = await workflowRuntimeRepository.updateById(
          workflow.id,
          updatePayload,
        );

        // Assert
        expect(updatedWorkflow.context).toMatchObject(createPayload.data.context);
      });
    });
  });
});
