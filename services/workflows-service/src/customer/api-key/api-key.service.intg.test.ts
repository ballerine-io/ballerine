import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { createCustomerOnly } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { initiateNestApp } from '@/test/helpers/nest-app-helper';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Customer, PrismaClient } from '@prisma/client';
import { ClsModule } from 'nestjs-cls';
import { ApiKeyService } from './api-key.service';
import { ApiKeyRepository } from './api-key.repository';

describe('#ApiKeyService', () => {
  let app: INestApplication;
  let apiKeyService: ApiKeyService;
  let prismaClient: PrismaClient;
  let customer: Customer;

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

    await createProject(prismaClient, customer, faker.datatype.uuid());
  });

  it('creates same a api key for customer using a salt should throw a unique constraint error', async () => {
    const apiKey1 = await apiKeyService.createHashedApiKey(customer.id, {
      key: 'blabla',
      salt: `$2b$10$FovZTB91/QQ4Yu28nvL8e.`,
    });

    expect(apiKey1).toBeDefined();
    expect(apiKey1).toMatchObject({
      hashedKey: '$2b$10$FovZTB91/QQ4Yu28nvL8e.E.4ogcDTTd1DZGlLCJnil55RObUr3uu',
      validUntil: null,
    });

    await expect(
      async () => await apiKeyService.createHashedApiKey(customer.id, { key: 'blabla' }),
    ).rejects.toThrow(`Unique constraint failed on the fields: (\`hashedKey\`)`);
  });

  it('Checks that we generate different api keys', async () => {
    const apiKey1 = await apiKeyService.createHashedApiKey(customer.id);
    const apiKey2 = await apiKeyService.createHashedApiKey(customer.id);

    expect(apiKey1).toBeDefined();
    expect(apiKey2).toBeDefined();
    expect(apiKey1.hashedKey).not.toEqual(apiKey2.hashedKey);

    expect(
      await prismaClient.apiKey.count({
        where: {
          customerId: customer.id,
        },
      }),
    ).toEqual(2);
  });

  it('should soft delete', async () => {
    const apiKey1 = await apiKeyService.createHashedApiKey(customer.id);

    expect(apiKey1).toBeDefined();

    await apiKeyService.deleteApiKey(apiKey1.hashedKey);

    await expect(
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

    await expect(apiKeyService.find(apiKey.hashedKey)).resolves.toBe(null);
  });

  it('api key should be less than 5 chars', async () => {
    const apiKeyVal = 'aaaa';

    await expect(async () =>
      apiKeyService.createHashedApiKey(customer.id, { key: apiKeyVal }),
    ).rejects.toThrow('Invalid key length');
  });
});
