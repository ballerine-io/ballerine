import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { createCustomerOnly } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { initiateNestApp } from '@/test/helpers/nest-app-helper';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Customer, PrismaClient, Project } from '@prisma/client';
import { ClsModule } from 'nestjs-cls';
import { ApiKeyService } from './api-key.service';
import { ApiKeyRepository } from './api-key.repository';
import { encryptApiKey, generateApiKey } from './utils';

describe('#ApiKeyService', () => {
  let app: INestApplication;
  let apiKeyService: ApiKeyService;
  let prismaClient: PrismaClient;
  let customer: Customer;
  let project: Project;

  beforeAll(cleanupDatabase);
  afterEach(tearDownDatabase);

  beforeAll(async () => {
    await cleanupDatabase();

    const servicesProviders = [ApiKeyService, ApiKeyRepository, PrismaService];

    app = await initiateNestApp(app, servicesProviders, [], [PrismaModule, ClsModule]);

    apiKeyService = app.get(ApiKeyService);
    prismaClient = app.get(PrismaService);
  });

  beforeEach(async () => {
    customer = await createCustomerOnly(
      prismaClient,
      faker.datatype.uuid(),
      '',
      '',
      'webhook-shared-secret',
    );

    project = await createProject(prismaClient, customer, faker.datatype.uuid());
  });

  it('Creating an API key for a customer using the same salt should throw a unique constraint error', async () => {
    const apiKey1 = await apiKeyService.createHashedApiKey(customer.id, { apiKey: 'blabla' });

    expect(apiKey1).toBeDefined();
    expect(apiKey1).toMatchObject({
      hashedKey: '0de819cc2ab05e54f9c83352fb0130b74e3eea07c53ed563173200be18b8ff6e',
      validUntil: null,
    });

    await expect(
      apiKeyService.createHashedApiKey(customer.id, { apiKey: 'blabla' }),
    ).rejects.toThrow(`Unique constraint failed on the fields: (\`hashedKey\`)`);
  });

  it('creates serveral api key for project', async () => {
    const apiKey1 = await apiKeyService.createHashedApiKey(customer.id);
    const apiKey2 = await apiKeyService.createHashedApiKey(customer.id);

    expect(apiKey1).toBeDefined();
    expect(apiKey2).toBeDefined();

    expect(apiKey1.hashedKey).not.toEqual(apiKey2.hashedKey);

    expect(
      prismaClient.apiKey.count({
        where: {
          customerId: customer.id,
        },
      }),
    ).resolves.toEqual(2);
  });

  it('same api key for different serveral api key for customer', async () => {
    const apiKey1 = await apiKeyService.createHashedApiKey(customer.id);
    const apiKey2 = await apiKeyService.createHashedApiKey(customer.id);

    expect(apiKey1).toBeDefined();
    expect(apiKey2).toBeDefined();
    expect(apiKey1.hashedKey).not.toEqual(apiKey2.hashedKey);
  });

  it('should soft delete', async () => {
    const apiKey1 = await apiKeyService.createHashedApiKey(customer.id);

    expect(apiKey1).toBeDefined();

    await apiKeyService.deleteApiKey(apiKey1.hashedKey);

    expect(
      prismaClient.apiKey.count({
        where: {
          customerId: customer.id,
        },
      }),
    ).resolves.toEqual(1);

    const dbApiKey = await prismaClient.apiKey.findFirstOrThrow({
      where: {
        customerId: customer.id,
      },
    });

    expect(dbApiKey?.deletedAt).not.toBeNull();
  });

  it('shouldnt be able to fetch deleted api key', async () => {
    const apiKey = await apiKeyService.createHashedApiKey(customer.id);

    expect(apiKey.hashedKey).toBeDefined();

    await apiKeyService.deleteApiKey(apiKey.hashedKey);

    expect(
      prismaClient.apiKey.count({
        where: {
          id: apiKey.id,
        },
      }),
    ).resolves.toEqual(1);

    expect(apiKeyService.find(apiKey.hashedKey)).resolves.toBe(null);
  });

  it('API key should not be less than 5 characters', async () => {
    const apiKeyVal = 'aaaa';

    expect(apiKeyService.createHashedApiKey(customer.id, { apiKey: apiKeyVal })).rejects.toThrow(
      'Invalid api key length',
    );

    expect(() => encryptApiKey(apiKeyVal)).toThrow('Invalid api key length');
  });
});
