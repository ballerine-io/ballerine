import { Injectable, OnModuleDestroy, Inject } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';
import { QueueOtelService } from './otel.service';
import { REDIS_CLIENT } from './redis.provider';
import { BullMQPrometheusService } from '@/common/monitoring/bullmq-prometheus.service';
import type { BullBoardInjectedInstance } from './types';
import { QueueBullboardService } from './queue-bullboard.service';

export interface QueueOptions<T = any> {
  name: string;
  concurrency?: number;
  jobOptions?: {
    attempts?: number;
    backoff?: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete?: boolean | number | { count: number; age: number };
    removeOnFail?: boolean | number | { count: number; age: number };
    priority?: number;
  };
}

@Injectable()
export class QueueService implements OnModuleDestroy {
  private redisClient: IORedis | null;
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private readonly shouldProcessJobs: boolean;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly queueOtelService: QueueOtelService,
    @Inject(REDIS_CLIENT) redisClient: IORedis | null,
    private readonly bullMQPrometheusService: BullMQPrometheusService,
    @Inject('BULLBOARD_INSTANCE') private readonly bullBoard?: BullBoardInjectedInstance,
    private readonly queueBullboardService?: QueueBullboardService,
  ) {
    this.shouldProcessJobs = this.determineIfShouldProcessJobs();
    this.logger.log(`Queue worker mode: ${this.shouldProcessJobs ? 'ENABLED' : 'DISABLED'}`);
    this.redisClient = redisClient;
  }

  private determineIfShouldProcessJobs(): boolean {
    if (env.IS_QUEUE_WORKER === true) {
      return true;
    }

    if (env.ENVIRONMENT_NAME === 'local' && env.IS_QUEUE_WORKER !== false) {
      return true;
    }

    return false;
  }

  public isWorkerEnabled(): boolean {
    return this.shouldProcessJobs;
  }

  private getQueue<T = any>(options: QueueOptions<T>): Queue<T> {
    if (!this.redisClient) {
      throw new Error('Redis client not initialized');
    }

    if (this.queues.has(options.name)) {
      return this.queues.get(options.name) as unknown as Queue<T>;
    }

    const queue = new Queue<T>(options.name, {
      connection: this.redisClient as any,
      defaultJobOptions: {
        attempts: options.jobOptions?.attempts ?? 3,
        backoff: options.jobOptions?.backoff ?? {
          type: options.jobOptions?.backoff?.type ?? 'exponential',
          delay: options.jobOptions?.backoff?.delay ?? 5000,
        },
        removeOnComplete: options.jobOptions?.removeOnComplete ?? { count: 100, age: 3600 * 24 },
        removeOnFail: options.jobOptions?.removeOnFail ?? false,
      },
    });

    this.queues.set(options.name, queue as Queue);
    this.logger.log(`Queue created: ${options.name}`);

    if (this.bullMQPrometheusService) {
      this.bullMQPrometheusService.registerQueue(queue);
    }

    if (this.shouldProcessJobs && this.bullBoard && this.queueBullboardService) {
      this.queueBullboardService.registerQueue(this.bullBoard, queue);
    }

    return queue;
  }

  registerWorker<T = any>(
    queueName: string,
    processor: (job: any) => Promise<any>,
    options: { concurrency?: number } = {},
  ): void {
    if (!this.redisClient) {
      throw new Error('Redis client not initialized');
    }

    if (!this.shouldProcessJobs) {
      this.logger.debug(
        `Skipping worker registration for queue ${queueName} (not a worker instance)`,
      );

      return;
    }

    if (this.workers.has(queueName)) {
      return;
    }

    const worker = new Worker<T, any, string>(queueName, processor, {
      connection: this.redisClient as any,
      concurrency: options.concurrency ?? 1,
      autorun: true,
    });

    worker.on('failed', (job, error) => {
      this.logger.error(`Job ${job?.id} failed in queue ${queueName}`, {
        error: error.message,
        queueName,
        jobId: job?.id,
        attempts: job?.attemptsMade,
        maxAttempts: job?.opts.attempts,
      });
    });

    worker.on('completed', job => {
      this.logger.debug(`Job ${job.id} completed in queue ${queueName}`, {
        queueName,
        jobId: job.id,
        attempts: job.attemptsMade,
      });
    });

    this.workers.set(queueName, worker as unknown as Worker<T, any, string>);
    this.logger.log(`Worker registered for queue: ${queueName}`);
  }

  createQueue<T = any>(queueName: string, options?: QueueOptions<T>): void {
    if (this.queues.has(queueName)) {
      // Optionally update options if needed
      return;
    }

    const queue = new Queue<T, any, string>(queueName, {
      connection: this.redisClient as any,
      defaultJobOptions: options?.jobOptions ?? {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 100, age: 3600 * 24 },
        removeOnFail: false,
      },
    });
    this.queues.set(queueName, queue as Queue);
    this.logger.log(`Queue created: ${queueName}`);

    if (this.bullMQPrometheusService) {
      this.bullMQPrometheusService.registerQueue(queue);
    }

    if (this.shouldProcessJobs && this.bullBoard && this.queueBullboardService) {
      this.queueBullboardService.registerQueue(this.bullBoard, queue);
    }
  }

  async onModuleDestroy() {
    const workerClosePromises = Array.from(this.workers.values()).map(worker =>
      worker.close().catch(err => this.logger.error(`Error closing worker`, { err })),
    );

    const queueClosePromises = Array.from(this.queues.values()).map(queue =>
      queue.close().catch(err => this.logger.error(`Error closing queue`, { err })),
    );

    await Promise.all([...workerClosePromises, ...queueClosePromises]);

    if (this.redisClient) {
      await this.redisClient
        .quit()
        .catch(err => this.logger.error(`Error closing Redis connection`, { err }));
      this.redisClient = null;
    }
  }
}
