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
import { WorkflowDefinitionRepository } from '@/workflow/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { Project } from '@prisma/client';
import { createProject } from '@/test/helpers/create-project';

describe('#EndUserControllerExternal', () => {
  let app: INestApplication;
  let endUserService: EndUserService;
  let project: Project;
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
      WorkflowDefinitionRepository,
      WorkflowRuntimeDataRepository,
      WorkflowService,
      EventEmitter2,
      PrismaService,
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
      [PrismaModule],
    );

    const customer = await createCustomer(
      await app.get(PrismaService),
      String(Date.now()),
      'secret',
      '',
    );
    project = await createProject(await app.get(PrismaService), customer, '1');
  });

  describe('POST /end-user', () => {
    it('creates an end-user', async () => {
      expect(await endUserService.list({}, [project.id])).toHaveLength(0);

      const response = await request(app.getHttpServer())
        .post('/external/end-users')
        .send({
          correlationId: faker.datatype.uuid(),
          endUserType: faker.random.word(),
          approvalState: 'APPROVED',
          firstName: 'test',
          lastName: 'lastName',
        })
        .set('authorization', 'Bearer secret');

      expect(response.status).toBe(201);

      const createdUser = await endUserService.getById(response.body.id, {}, [project.id]);
      expect(createdUser).toMatchObject({
        firstName: 'test',
        lastName: 'lastName',
      });
    });
  });
});
