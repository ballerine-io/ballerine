/* eslint-disable @typescript-eslint/no-unsafe-call */
import { mock } from 'jest-mock-extended';
import { PrismaService } from '@/prisma/prisma.service';
import { HealthService } from './health.service';

describe('Testing the HealthService', () => {
  //ARRANGE
  let prismaService: PrismaService;
  let healthService: HealthService;

  describe('Testing the isDbReady function in HealthService class', () => {
    beforeEach(() => {
      prismaService = mock<PrismaService>();
      healthService = new HealthService(prismaService);
    });
    it('should return true if allow connection to db', async () => {
      //ARRANGE
      (prismaService.$queryRaw as jest.Mock).mockReturnValue(Promise.resolve(true));
      //ACT
      const response = await healthService.isDbReady();
      //ASSERT
      expect(response).toBe(true);
    });
    it('should return false if db is not available', async () => {
      //ARRANGE
      (prismaService.$queryRaw as jest.Mock).mockReturnValue(Promise.reject(false));
      //ACT
      const response = await healthService.isDbReady();
      //ASSERT
      expect(response).toBe(false);
    });
  });
});
