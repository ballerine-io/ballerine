import { ConnectionOptions, Job, Queue, Worker } from 'bullmq';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CONFIG } from '@/redis/const/redis-config';
import { env } from '@/env';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { QUEUES } from '@/bull-mq/consts';

@Injectable()
export abstract class BaseQueueWorkerService<T = any> implements OnModuleDestroy {
  protected queue?: Queue;
  protected worker?: Worker;
  protected connectionOptions: ConnectionOptions;
  protected deadLetterQueue?: Queue;

  protected constructor(protected queueName: string, protected readonly logger: AppLoggerService) {
    this.connectionOptions = {
      ...REDIS_CONFIG,
    };

    if (!env.QUEUE_SYSTEM_ENABLED) {
      return;
    }

    this.queue = new Queue(queueName, {
      connection: this.connectionOptions,
      defaultJobOptions: {
        ...Object.entries(QUEUES).find(([_, queueOptions]) => queueOptions.name === queueName)?.[1]
          .config,
      },
    });

    this.deadLetterQueue = new Queue(`${queueName}-dlq`, { connection: this.connectionOptions });

    if (env.IS_WORKER_SERVICE !== true) {
      this.initializeWorker();
    }
  }

  abstract handleJob(job: Job<T>): Promise<void>;

  async addJob(jobData: T, jobOptions = {}): Promise<void> {
    await this.queue?.add(this.queueName, jobData, jobOptions);
  }

  protected initializeWorker() {
    this.worker = new Worker(
      this.queueName,
      async (job: Job<T>) => {
        await this.handleJob(job);
      },
      { connection: this.connectionOptions },
    );

    this.worker?.on('completed', (job: Job) => {
      this.logger.log(`Webhook job ${job.id} completed successfully`);
    });

    this.worker?.on('failed', async (job, error, prev) => {
      const queueConfig = Object.entries(QUEUES).find(
        ([_, queueOptions]) => queueOptions.name === this.queueName,
      )?.[1]?.config;

      const maxAllowedRetries = queueConfig?.attempts || 15;
      const maxRetries = job?.attemptsMade || 0;

      if (maxRetries >= maxAllowedRetries) {
        this.logger.error(`Job ${job?.id} failed permanently. Moving to DLQ.`);
        await this.deadLetterQueue?.add(`${this.queueName}-dlq`, job?.data);
      } else {
        this.logger.error(
          `Webhook job ${job?.id} failed. Attempt: ${maxRetries}. Error: ${error.message}`,
        );
      }
    });

    this.queue?.on('cleaned', (jobs, type) => {
      this.logger.log(`${jobs.length} ${type} jobs have been cleaned from the webhook queue`);
    });
  }

  async onModuleDestroy() {
    await Promise.all([this.worker?.close(), this.queue?.close()]);
  }
}
