import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { fetchServiceFromModule } from '@/test/helpers/nest-app-helper';
import { PrismaModule } from 'nestjs-prisma';
import { BusinessRepository } from '@/business/business.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { Project } from '@prisma/client';
import { createCustomer } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { faker } from '@faker-js/faker';
import { ProjectScopeService } from '@/project/project-scope.service';

describe('BusinessRepository #integration #repository', () => {
  let businessRepository: BusinessRepository;
  let project: Project;

  beforeAll(async () => {
    await cleanupDatabase();

    businessRepository = (await fetchServiceFromModule(BusinessRepository, [
      PrismaModule,
      ProjectScopeService,
    ])) as unknown as BusinessRepository;

    const prismaService = (await fetchServiceFromModule(PrismaService, [
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
  });

  describe('BusinessRepository.create', () => {
    describe('when creating a business with unrecognized fields', () => {
      it('should not throw', async () => {
        // Arrange
        const createPayload = {
          data: {
            companyName: 'dwadaw',
            // @ts-expect-error - testing fields not specified in the validation schema
            workflowRuntimeConfig: {
              id: '123',
              name: 'test',
              config: {},
            },
            workflowRuntimeId: '123',
            additionalInfo: {
              firstName: 'test',
              lastName: 'test',
            },
            project: { connect: { id: project.id } },
          },
        } satisfies Parameters<(typeof businessRepository)['create']>[0];

        // Act
        const createBusinessPromise = businessRepository.create(createPayload);

        // Assert
        await expect(createBusinessPromise).resolves.not.toThrow();
      });
    });
  });

  afterAll(async () => {
    await cleanupDatabase();
    await tearDownDatabase();
  });
});
