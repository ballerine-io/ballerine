import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { initiateNestApp } from '@/test/helpers/nest-app-helper';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Customer, PrismaClient, Project } from '@prisma/client';
import { ClsModule } from 'nestjs-cls';
import { ApiKeyService } from './api-key.service';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';

describe('#ApiKeyService', () => {
  let app: INestApplication;
  let apiKeyService: ApiKeyService;
  let prismaClient: PrismaClient;
  let customer: Customer;
  let project: Project;

  beforeAll(cleanupDatabase);
  afterEach(tearDownDatabase);

  beforeAll(async () => {
    // await cleanupDatabase();

    const servicesProviders = [ApiKeyService, PrismaService];

    app = await initiateNestApp(app, servicesProviders, [], [PrismaModule, ClsModule]);

    apiKeyService = app.get(ApiKeyService);
    prismaClient = app.get(PrismaService);
  });

  describe('Api key', () => {
    beforeEach(async () => {
      customer = await createCustomer(
        prismaClient,
        faker.datatype.uuid(),
        'secret3',
        '',
        '',
        'webhook-shared-secret',
      );

      project = await createProject(prismaClient, customer, faker.datatype.uuid());
    });

    it('creates same a api key for project using a salt should throw a unique constraint error', async () => {
      const salt = '$2b$10$iz4VBFiMKfby80GHAkxWXu';

      const apiKey1 = await apiKeyService.createApiKey(project.id, { apiKey: 'blabla', salt });

      expect(apiKey1).toBeDefined();
      expect(apiKey1).toMatchObject({
        hashedKey: '$2b$10$iz4VBFiMKfby80GHAkxWXuGZHyrVX2glbUn4nSbxrstiGb.IIeFUm',
        salt: '$2b$10$iz4VBFiMKfby80GHAkxWXu',
        validUntil: null,
      });

      await expect(
        apiKeyService.createApiKey(project.id, { apiKey: 'blabla', salt }),
      ).rejects.toThrow(`Unique constraint failed on the fields: (\`hashedKey\`)`);
    });

    it('creates serveral api key for project', async () => {
      const apiKey1 = await apiKeyService.createApiKey(project.id);
      const apiKey2 = await apiKeyService.createApiKey(project.id);

      expect(apiKey1).toBeDefined();
      expect(apiKey2).toBeDefined();

      expect(apiKey1.hashedKey).not.toEqual(apiKey2.hashedKey);

      expect(
        prismaClient.apiKey.count({
          where: {
            projectId: project.id,
          },
        }),
      ).resolves.toEqual(2);
    });

    it('same api key for different serveral api key for project', async () => {
      const apiKey1 = await apiKeyService.createApiKey(project.id);
      const apiKey2 = await apiKeyService.createApiKey(project.id);

      expect(apiKey1).toBeDefined();
      expect(apiKey2).toBeDefined();
      expect(apiKey1.hashedKey).not.toEqual(apiKey2.hashedKey);
    });
  });
});
