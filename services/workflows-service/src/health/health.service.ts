import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly redis: RedisService,
  ) {}

  async isDbReady(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return true;
    } catch (error) {
      return false;
    }
  }

  async isRedisReady(): Promise<boolean> {
    return this.redis.isHealthy();
  }
}
