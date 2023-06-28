import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { UserActivityTrackerMiddleware } from '@/common/middlewares/user-activity-tracker.middleware';
import { PrismaModule } from '@/prisma/prisma.module';
import { commonTestingModules } from '@/test/helpers/nest-app-helper';
import { UserModule } from '@/user/user.module';
import { UserService } from '@/user/user.service';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import dayjs from 'dayjs';

describe('UserActivityTrackerMiddleware', () => {
  const testUserPayload = {
    firstName: 'Test',
    lastName: 'User',
    password: '',
    email: 'example@mail.com',
    roles: [],
  } as unknown as User;
  let moduleRef: TestingModule;
  let app: INestApplication;
  let testUser: User;
  let middleware: UserActivityTrackerMiddleware;
  let userService: UserService;
  let callback: jest.Mock;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule, PrismaModule, ...commonTestingModules],
    }).compile();
    app = moduleRef.createNestApplication();
    middleware = new UserActivityTrackerMiddleware(app.get(AppLoggerService), app.get(UserService));
    userService = app.get(UserService);
    callback = jest.fn(() => null);
  });

  describe('when request not includes session and user', () => {
    it('will call callback', async () => {
      await middleware.use({} as Request, {} as Response, callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('when session and user in request', () => {
    describe('when lastActiveAt unset', () => {
      beforeEach(async () => {
        testUser = await app.get(UserService).create({ data: testUserPayload as any });
      });

      afterEach(async () => {
        await app.get(UserService).deleteById(testUser.id);
      });

      it('will be set on middleware call', async () => {
        await middleware.use(
          { user: testUser, session: testUser } as any,
          {} as Response,
          callback,
        );

        const updatedUser = await app.get(UserService).getById(testUser.id);

        expect(updatedUser.lastActiveAt).toBeTruthy();
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    describe('when lastActiveAt is set', () => {
      beforeEach(async () => {
        testUser = await app.get(UserService).create({ data: testUserPayload as any });
        app.use(middleware.use.bind(middleware));
      });

      afterEach(async () => {
        await app.get(UserService).deleteById(testUser.id);
      });

      it('will not be changed when lastActiveAt not expired', async () => {
        const nonExpiredDate = dayjs().subtract(middleware.UPDATE_INTERVAL - 10, 'ms');

        testUser = await userService.updateById(testUser.id, {
          data: { lastActiveAt: nonExpiredDate.toDate() },
        });

        await middleware.use(
          { user: testUser, session: testUser } as any,
          {} as Response,
          callback,
        );

        const user = await userService.getById(testUser.id);

        expect(user.lastActiveAt).toEqual(nonExpiredDate.toDate());
        expect(callback).toBeCalledTimes(1);
      });

      it('will be updated when lastActiveAt expired', async () => {
        const expiredDate = dayjs().subtract(middleware.UPDATE_INTERVAL + 10, 'ms');

        testUser.lastActiveAt = expiredDate.toDate();

        await middleware.use(
          { user: testUser, session: testUser } as any,
          {} as Response,
          callback,
        );

        const updatedUser = await userService.getById(testUser.id);

        expect(Number(updatedUser.lastActiveAt)).toBeGreaterThan(Number(expiredDate.toDate()));
        expect(callback).toBeCalledTimes(1);
      });
    });
  });
});
