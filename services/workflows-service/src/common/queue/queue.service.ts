import { Injectable, OnModuleDestroy, Inject } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';
import { RedisService } from '../redis/redis.service';
import { BullMQPrometheusService } from '@/common/monitoring/bullmq-prometheus.service';
import type { BullBoardInjectedInstance, IQueueService, QueueOptions } from './types';
import { QueueBullboardService } from './queue-bullboard.service';

@Injectable()
export class BullMQQueueService implements OnModuleDestroy, IQueueService {
  private redisClient: IORedis | null;
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private readonly shouldProcessJobs: boolean;

  async addJob<T = any>(queueName: string, job_name: string, data: T, opts?: any): Promise<any> {
    const queue = this.getQueue(queueName);

    return queue.add(job_name, data, {
      priority: opts?.priority,
    });
  }

  constructor(
    private readonly logger: AppLoggerService,
    private readonly redisService: RedisService,
    private readonly bullMQPrometheusService: BullMQPrometheusService,
    @Inject('BULLBOARD_INSTANCE') private readonly bullBoard?: BullBoardInjectedInstance,
    private readonly queueBullboardService?: QueueBullboardService,
  ) {
    this.shouldProcessJobs = this.determineIfShouldProcessJobs();
    this.logger.log(`Queue worker mode: ${this.shouldProcessJobs ? 'ENABLED' : 'DISABLED'}`);
    this.redisClient = this.redisService.client;
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

  public getQueue(queueName: string): Queue {
    if (!this.redisClient) {
      throw new Error('Redis client not initialized');
    }

    if (this.queues.has(queueName)) {
      return this.queues.get(queueName) as Queue;
    }

    throw new Error(`Queue with name '${queueName}' does not exist. Please create it first.`);
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

    const worker = new Worker(queueName, processor, {
      connection: this.redisClient,
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

    this.workers.set(queueName, worker);
    this.logger.log(`Worker registered for queue: ${queueName}`);
  }

  createQueue(queueName: string, options?: QueueOptions): void {
    if (this.queues.has(queueName)) {
      return;
    }

    const queue = new Queue(queueName, {
      connection: this.redisClient as IORedis,
      defaultJobOptions: options?.jobOptions ?? {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 100, age: 3600 * 24 },
        removeOnFail: false,
      },
    });
    this.queues.set(queueName, queue);
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
  }

  async setupJobScheduler<T = any>(
    queueName: string,
    schedulerId: string,
    scheduleOpts: { every: number },
    jobOpts: {
      name: string;
      data: T;
      opts?: any;
    },
  ): Promise<any> {
    try {
      const queue = this.getQueue(queueName);
      const jobName = jobOpts.name;
      const firstJob = await queue.upsertJobScheduler(
        schedulerId,
        { every: scheduleOpts.every, jobId: schedulerId },
        {
          name: jobName,
          data: jobOpts.data || { timestamp: Date.now() },
          opts: {
            attempts: jobOpts.opts?.attempts || 3,
            backoff: jobOpts.opts?.backoff || {
              type: 'exponential',
              delay: 3000,
            },
          },
        },
      );
      this.logger.log(`Created job scheduler: ${schedulerId}`, {
        schedulerId,
        every: scheduleOpts.every,
        jobId: firstJob?.id,
      });

      return firstJob;
    } catch (error) {
      this.logger.error(`Failed to set up job scheduler: ${schedulerId}`, { error });
      throw error;
    }
  }
}
