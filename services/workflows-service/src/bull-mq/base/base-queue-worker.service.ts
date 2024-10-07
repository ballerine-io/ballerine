import { ConnectionOptions, Job, Queue, Worker } from 'bullmq';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CONFIG } from '@/redis/const/redis-config';
import { env } from '@/env';

@Injectable()
export abstract class BaseQueueWorkerService<T = any> implements OnModuleDestroy {
  protected queue?: Queue;
  protected worker?: Worker;
  protected connectionOptions: ConnectionOptions;

  protected constructor(private queueName: string) {
    this.connectionOptions = {
      ...REDIS_CONFIG,
    };

    if (env.QUEUE_SYSTEM_ENABLED !== true) {
      return;
    }

    this.queue = new Queue(queueName, { connection: this.connectionOptions });
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
  }

  async onModuleDestroy() {
    await Promise.all([this.worker?.close(), this.queue?.close()]);
  }
}
