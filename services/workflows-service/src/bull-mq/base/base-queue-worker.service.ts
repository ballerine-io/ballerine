import { ConnectionOptions, Job, Queue, QueueListener, Worker } from 'bullmq';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { REDIS_CONFIG } from '@/redis/const/redis-config';
import { env } from '@/env';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { QUEUES } from '@/bull-mq/consts';
import { WorkerListener } from 'bullmq/dist/esm/classes/worker';
import { TJobPayloadMetadata } from '@/bull-mq/types';

@Injectable()
export abstract class BaseQueueWorkerService<T = any> implements OnModuleDestroy, OnModuleInit {
  protected queue?: Queue;
  protected worker?: Worker;
  protected connectionOptions: ConnectionOptions;
  protected deadLetterQueue?: Queue | undefined;

  protected constructor(protected queueName: string, protected readonly logger: AppLoggerService) {
    this.connectionOptions = {
      ...REDIS_CONFIG,
    };

    if (!env.QUEUE_SYSTEM_ENABLED) {
      return;
    }

    const currentQueue = Object.entries(QUEUES).find(
      ([_, queueOptions]) => queueOptions.name === queueName,
    );

    if (!currentQueue) {
      throw new Error(`Queue configuration of ${queueName} not found in QUEUES`);
    }

    const queueConfig = currentQueue[1];
    this.queue = new Queue(queueName, {
      connection: this.connectionOptions,
      defaultJobOptions: {
        ...queueConfig.config,
      },
    });

    this.deadLetterQueue =
      'dlq' in queueConfig
        ? new Queue(queueConfig.dlq, { connection: this.connectionOptions })
        : undefined;

    this.initializeWorker();
  }

  abstract handleJob(job: Job<{ jobData: T; metadata: TJobPayloadMetadata }>): Promise<void>;

  async addJob(jobData: T, metadata: TJobPayloadMetadata = {}, jobOptions = {}): Promise<void> {
    await this.queue?.add(this.queueName, { metadata, jobData }, jobOptions);
  }

  protected initializeWorker() {
    this.worker = new Worker(
      this.queueName,
      async (job: Job<{ jobData: T; metadata: TJobPayloadMetadata }>) => {
        await this.handleJob(job);
      },
      { connection: this.connectionOptions },
    );

    this.addWorkerListeners();
    this.addQueueListeners();
  }

  protected addWorkerListeners() {
    this.setWorkerListener({
      worker: this.worker,
      eventName: 'active',
      listener: (job: Job) => {
        this.logger.log(`Webhook job ${job.id} is active`);
      },
    });

    this.setWorkerListener({
      worker: this.worker,
      eventName: 'failed',
      listener: async (job, error, prev) => {
        const queueConfig =
          Object.entries(QUEUES).find(
            ([_, queueOptions]) => queueOptions.name === this.queueName,
          )?.[1]?.config || QUEUES.DEFAULT.config;

        const maxAllowedRetries = queueConfig.attempts;
        const currentAttempts = job?.attemptsMade ?? 0;

        if (currentAttempts >= maxAllowedRetries) {
          if (this.deadLetterQueue) {
            this.logger.error(`Job ${job?.id} failed permanently. Moving to DLQ.`);
            await this.deadLetterQueue.add(`${this.queueName}-dlq`, job?.data);
          }

          this.logger.error(`Job ${job?.id} failed permanently. Max attempts reached.`);
        } else {
          this.logger.warn(
            `Webhook job ${job?.id} failed. Attempt: ${currentAttempts}. Error: ${error.message}`,
          );
        }
      },
    });
  }

  protected addQueueListeners() {
    this.setQueueListener({
      queue: this.queue,
      eventName: 'cleaned',
      listener: (jobs, type) => {
        this.logger.log(`${jobs.length} ${type} jobs have been cleaned from the webhook queue`);
      },
    });
  }

  protected setWorkerListener<T extends keyof WorkerListener>({
    worker,
    eventName,
    listener,
  }: {
    worker: Worker | undefined;
    eventName: T;
    listener: WorkerListener[T];
  }) {
    worker?.removeAllListeners(eventName);
    worker?.on(eventName, listener);
  }

  protected setQueueListener<T extends keyof QueueListener<any, any, any>>({
    queue,
    eventName,
    listener,
  }: {
    queue: Queue | undefined;
    eventName: T;
    listener: QueueListener<any, any, any>[T];
  }) {
    return async () => {
      queue?.removeAllListeners(eventName);
      queue?.on(eventName, listener);
    };
  }

  async onModuleDestroy() {
    await this.queue?.pause();
    await Promise.all([this.worker?.close(), this.queue?.close()]);

    this.logger.log(`Queue ${this.queueName} is paused and closed`);
  }

  async onModuleInit() {
    if (this.queue) {
      const isPaused = await this.queue.isPaused();

      if (isPaused) {
        await this.queue.resume();
      }

      const isPausedAfterResume = await this.queue?.isPaused();

      if (isPausedAfterResume) {
        this.logger.error(`Queue ${this.queueName} is still paused after trying to resume it`);
      }
    }
  }
}
