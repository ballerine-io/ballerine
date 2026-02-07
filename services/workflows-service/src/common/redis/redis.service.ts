import { Injectable, OnModuleDestroy } from '@nestjs/common';
import IORedis from 'ioredis';
import { env } from '@/env';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

const REDIS_RECONNECT_MAX_DELAY_MS = 30_000;
const REDIS_RECONNECT_BASE_DELAY_MS = 500;
const REDIS_HEALTH_CHECK_INTERVAL_MS = 30_000;

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client!: IORedis;
  private healthCheckInterval?: ReturnType<typeof setInterval>;

  constructor(private readonly logger: AppLoggerService) {
    if (!env.QUEUE_SYSTEM_ENABLED) {
      Object.defineProperty(this, 'client', {
        get: () => {
          this.logger.warn('Redis client is not available when QUEUE_SYSTEM_ENABLED is false');
        },
      });

      return;
    }

    const redisConfig: import('ioredis').RedisOptions = {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      // Required by BullMQ — disables per-request retry limit so
      // blocking commands (BRPOPLPUSH etc.) can wait indefinitely.
      maxRetriesPerRequest: null,
      ...(env.ENVIRONMENT_NAME !== 'local' ? { tls: {} } : {}),

      // Reconnection strategy: exponential backoff capped at 30 s.
      retryStrategy(times: number) {
        const delay = Math.min(times * REDIS_RECONNECT_BASE_DELAY_MS, REDIS_RECONNECT_MAX_DELAY_MS);

        return delay;
      },

      // Attempt to reconnect when the connection is lost unexpectedly.
      reconnectOnError(err: Error) {
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];

        return targetErrors.some(target => err.message.includes(target));
      },
    };
    this.client = new IORedis(redisConfig);

    this.client.on('error', error => {
      this.logger.error('Redis connection error', { error });
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    this.client.on('reconnecting', (delay: number) => {
      this.logger.warn(`Redis reconnecting in ${delay}ms`);
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    this.logger.log('Redis client initialized via RedisService.');

    // Periodic health check — logs a warning when the connection is unhealthy
    // and lets the readiness probe surface the issue.
    this.healthCheckInterval = setInterval(() => {
      void this.ping().catch(() => {
        this.logger.warn('Redis health check failed — connection may be down');
      });
    }, REDIS_HEALTH_CHECK_INTERVAL_MS);
  }

  /**
   * Lightweight health check used by the readiness probe.
   * Returns `true` when Redis responds to PING within a reasonable time.
   */
  async isHealthy(): Promise<boolean> {
    if (!env.QUEUE_SYSTEM_ENABLED) {
      // If queues are disabled Redis is not required — report healthy.
      return true;
    }

    try {
      const result = await this.ping();

      return result === 'PONG';
    } catch {
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    if (this.client) {
      await this.client.quit();
    }
  }

  private async ping(): Promise<string> {
    return this.client.ping();
  }
}

export const redisProvider = {
  provide: REDIS_CLIENT,
  useExisting: RedisService,
};
