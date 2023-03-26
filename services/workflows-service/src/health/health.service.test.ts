import { mock } from 'jest-mock-extended';
import { PrismaService } from 'nestjs-prisma';
import { HealthService } from './health.service';

describe('Testing the HealthService', () => {
  //ARRANGE
  let prismaService: PrismaService;
  let healthServiceBase: HealthService;

  describe('Testing the isDbReady function in HealthService class', () => {
    beforeEach(() => {
      prismaService = mock<PrismaService>();
      healthServiceBase = new HealthService(prismaService);
    });
    it('should return true if allow connection to db', async () => {
      //ARRANGE
      prismaService.$queryRaw
        //@ts-ignore
        .mockReturnValue(Promise.resolve(true));
      //ACT
      const response = await healthServiceBase.isDbReady();
      //ASSERT
      expect(response).toBe(true);
    });
    it('should return false if db is not available', async () => {
      //ARRANGE
      prismaService.$queryRaw
        //@ts-ignore
        .mockReturnValue(Promise.reject(false));
      //ACT
      const response = await healthServiceBase.isDbReady();
      //ASSERT
      expect(response).toBe(false);
    });
  });
});
