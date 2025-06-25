import { Injectable, OnModuleDestroy } from '@nestjs/common';
import IORedis from 'ioredis';
import { env } from '@/env';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: IORedis;

  constructor(private readonly logger: AppLoggerService) {
    if (!env.QUEUE_SYSTEM_ENABLED) {
      this.client = null as any;

      return;
    }

    const redisConfig = {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      ...(env.ENVIRONMENT_NAME !== 'local' ? { tls: {} } : {}),
    };
    this.client = new IORedis(redisConfig);

    this.client.on('error', error => {
      this.logger.error('Redis connection error', { error });
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    this.logger.log('Redis client initialized via RedisService.');
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }
}

export const redisProvider = {
  provide: REDIS_CLIENT,
  useExisting: RedisService,
};
