import request from 'supertest';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { INestApplication } from '@nestjs/common';
import { fetchServiceFromModule, initiateNestApp } from '@/test/helpers/nest-app-helper';
import { EndUserControllerExternal } from '@/end-user/end-user.controller.external';
import { faker } from '@faker-js/faker';
import { EndUserService } from '@/end-user/end-user.service';
import { PrismaModule } from 'nestjs-prisma';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';

describe('#EndUserControllerExternal', () => {
  let app: INestApplication;
  let endUserService: EndUserService;
  beforeEach(cleanupDatabase);
  afterEach(tearDownDatabase);

  beforeAll(async () => {
    const servicesProviders = [EndUserRepository, PrismaService, FilterService, FilterRepository];
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
  });

  describe('POST /end-user', () => {
    it('it creates an end-user', async () => {
      expect(await endUserService.list({})).toHaveLength(0);

      const response = await request(app.getHttpServer()).post('/external/end-users').send({
        correlationId: faker.datatype.uuid(),
        endUserType: faker.random.word(),
        approvalState: 'APPROVED',
        firstName: 'test',
        lastName: 'lastName',
      });

      expect(response.status).toBe(201);
      const allEndUsers = await endUserService.list({});
      expect(allEndUsers[0]).toMatchObject({
        firstName: 'test',
        lastName: 'lastName',
      });
    });
  });
});
