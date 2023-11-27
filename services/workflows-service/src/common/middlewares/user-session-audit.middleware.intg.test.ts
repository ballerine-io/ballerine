import { UserSessionAuditMiddleware } from '@/common/middlewares/user-session-audit.middleware';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserService } from '@/user/user.service';
import { UserRepository } from '@/user/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { Project, User } from '@prisma/client';
import type { Request, Response } from 'express';
import dayjs from 'dayjs';
import { commonTestingModules } from '@/test/helpers/nest-app-helper';
import { Injectable } from '@nestjs/common';
import { PasswordService } from '@/auth/password/password.service';
import { PrismaService } from 'nestjs-prisma';
import { createCustomer } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { ProjectModule } from '@/project/project.module';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';

@Injectable()
class FakePasswordService {
  async compare(password: string, encrypted: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  async hash(password: string): Promise<string> {
    return Promise.resolve(password);
  }
}

describe('UserSessionAuditMiddleware', () => {
  const testUserPayload = (index: number) => {
    return {
      firstName: 'Test',
      lastName: 'User',
      password: '',
      email: `example${index}@mail.com`,
      roles: [],
    } as unknown as User;
  };
  let app: TestingModule;
  let testUser: User;
  let middleware: UserSessionAuditMiddleware;
  let userService: UserService;
  let callback: jest.Mock;
  let project: Project;

  beforeEach(async () => {
    await cleanupDatabase();

    app = await Test.createTestingModule({
      imports: [PrismaModule, ProjectModule, ...commonTestingModules],
      providers: [
        {
          provide: PasswordService,
          useClass: FakePasswordService,
        },
        UserService,
        UserRepository,
        PrismaService,
      ],
    }).compile();
    middleware = new UserSessionAuditMiddleware(app.get(AppLoggerService), app.get(UserService));
    userService = app.get(UserService);
    const prismaService = app.get(PrismaService);
    const customer = await createCustomer(
      prismaService,
      String(Date.now()),
      'secret',
      '',
      '',
      'webhookSharedSecret',
    );
    project = await createProject(prismaService, customer, '3');

    callback = jest.fn(() => null);
  });

  afterEach(tearDownDatabase);

  describe('when request not includes session and user', () => {
    it('will call callback', async () => {
      await middleware.use({} as Request, {} as Response, callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('when session and user in request', () => {
    describe('when lastActiveAt unset', () => {
      beforeEach(async () => {
        testUser = await app
          .get(UserService)
          .create({ data: testUserPayload(1) as any }, project.id);
      });

      afterEach(async () => {
        await app.get(UserService).deleteById(testUser.id, {}, [project.id]);
      });

      it('will be set on middleware call', async () => {
        await middleware.use(
          { user: { user: testUser }, session: testUser } as any,
          {} as Response,
          callback,
        );

        const updatedUser = await app.get(UserService).getByIdUnscoped(testUser.id, {});

        expect(updatedUser.lastActiveAt).toBeTruthy();
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    describe('when lastActiveAt is set', () => {
      beforeEach(async () => {
        testUser = await app
          .get(UserService)
          .create({ data: testUserPayload(2) as any }, project.id);
      });

      afterEach(async () => {
        await app.get(UserService).deleteById(testUser.id, {}, [project.id]);
      });

      it('will not be changed when lastActiveAt not expired', async () => {
        const nonExpiredDateString = dayjs()
          .subtract(middleware.UPDATE_INTERVAL - 10, 'ms')
          .toISOString();

        testUser = await userService.updateById(testUser.id, {
          data: { lastActiveAt: nonExpiredDateString },
        });

        await middleware.use(
          { user: testUser, session: testUser } as any,
          {} as Response,
          callback,
        );

        const user = await userService.getByIdUnscoped(testUser.id, {});

        expect(user.lastActiveAt?.toISOString()).toBe(nonExpiredDateString);
        expect(callback).toBeCalledTimes(1);
      });

      it('will be updated when lastActiveAt expired', async () => {
        const expiredDate = dayjs().subtract(middleware.UPDATE_INTERVAL + 10, 'ms');

        testUser.lastActiveAt = expiredDate.toDate();

        await middleware.use(
          { user: { user: testUser }, session: testUser } as any,
          {} as Response,
          callback,
        );

        // @ts-ignore
        const updatedUser = await userService.getByIdUnscoped(testUser.id);

        expect(Number(updatedUser.lastActiveAt)).toBeGreaterThan(Number(expiredDate));
        expect(callback).toBeCalledTimes(1);
      });
    });
  });
});
