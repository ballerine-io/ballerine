import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';
import { QueueOtelService } from './otel.service';

export type JobProcessor<T = any> = (job: Job<T>) => Promise<any>;

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
  private redisClient: IORedis | null = null;
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private readonly shouldProcessJobs: boolean;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly queueOtelService: QueueOtelService,
  ) {
    this.shouldProcessJobs = this.determineIfShouldProcessJobs();
    this.logger.log(`Queue worker mode: ${this.shouldProcessJobs ? 'ENABLED' : 'DISABLED'}`);
    if (env.QUEUE_SYSTEM_ENABLED) {
      this.initRedisConnection();
    }
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

  private initRedisConnection() {
    try {
      const redisConfig = {
        host: env.REDIS_HOST || 'localhost',
        port: env.REDIS_PORT || 6379,
        password: env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
      };

      this.redisClient = new IORedis({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
      });

      this.redisClient.on('error', error => {
        this.logger.error('Redis connection error', { error });
      });

      this.redisClient.on('connect', () => {
        this.logger.log('Redis connected successfully');
      });

      this.logger.log('Redis client initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Redis client', { error });
      throw error;
    }
  }

  getQueue<T = any, R = any, N extends string = string>(options: QueueOptions<T>): Queue<T, R, N> {
    if (!this.redisClient) {
      throw new Error('Redis client not initialized');
    }

    if (this.queues.has(options.name)) {
      return this.queues.get(options.name) as unknown as Queue<T, R, N>;
    }

    const queue = new Queue<T, R, N>(options.name, {
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

    return queue;
  }

  registerWorker<T = any, R = any, N extends string = string>(
    queueName: string,
    processor: JobProcessor<T>,
    options: {
      concurrency?: number;
      forceLocalProcessing?: boolean;
    } = {},
  ): Worker<T, R, N> | null {
    if (!this.redisClient) {
      throw new Error('Redis client not initialized');
    }

    if (!this.shouldProcessJobs && !options.forceLocalProcessing) {
      this.logger.debug(
        `Skipping worker registration for queue ${queueName} (not a worker instance)`,
      );
      return null;
    }

    if (this.workers.has(queueName)) {
      return this.workers.get(queueName) as unknown as Worker<T, R, N>;
    }

    const worker = new Worker<T, R, N>(
      queueName,
      async job => {
        try {
          return await processor(job);
        } catch (error) {
          this.logger.error(`Error processing job ${job.id} in queue ${queueName}`, {
            error,
            jobId: job.id,
            queueName,
          });
          throw error;
        }
      },
      {
        connection: this.redisClient as any,
        concurrency: options.concurrency ?? 1,
        autorun: true,
      },
    );

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

    this.workers.set(queueName, worker as unknown as Worker);
    this.logger.log(`Worker registered for queue: ${queueName}`);

    return worker;
  }

  async setupJobScheduler<T = any>(
    queue: Queue,
    schedulerId: string,
    options: {
      every: number;
      data?: T;
      jobName?: string;
      jobOptions?: {
        attempts?: number;
        backoff?: {
          type: 'exponential' | 'fixed';
          delay: number;
        };
      };
    },
  ) {
    try {
      const schedulers = await queue.getJobSchedulers();
      const existingScheduler = schedulers.find(s => s.id === schedulerId);

      if (existingScheduler) {
        this.logger.log(`Job scheduler already exists: ${schedulerId}`, {
          schedulerId,
          pattern: existingScheduler.pattern,
          every: existingScheduler.every,
        });
        return existingScheduler;
      }

      const jobName = options.jobName || 'scheduled-job';
      const firstJob = await queue.upsertJobScheduler(
        schedulerId,
        { every: options.every, jobId: schedulerId },
        {
          name: jobName,
          data: options.data || { timestamp: Date.now() },
          opts: {
            attempts: options.jobOptions?.attempts || 10,
            backoff: options.jobOptions?.backoff || {
              type: 'exponential',
              delay: 10000,
            },
          },
        },
      );

      this.logger.log(`Created job scheduler: ${schedulerId}`, {
        schedulerId,
        every: options.every,
        firstJobId: firstJob?.id,
      });

      return firstJob;
    } catch (error) {
      this.logger.error(`Failed to set up job scheduler: ${schedulerId}`, { error });
      throw error;
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
