import { Job, Queue, Worker } from 'bullmq';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export abstract class BaseQueueService<T = any> implements OnModuleDestroy {
  protected queue: Queue;
  protected worker!: Worker;

  constructor(private queueName: string) {
    this.queue = new Queue(queueName);
  }

  abstract handleJob(job: Job<T>): Promise<void>;

  async addJob(jobData: T, jobOptions = {}): Promise<void> {
    await this.queue.add(this.queueName, jobData, jobOptions);
  }

  protected initializeWorker() {
    this.worker = new Worker(this.queueName, async (job: Job<T>) => {
      await this.handleJob(job);
    });
  }

  async onModuleDestroy() {
    await Promise.all([this.worker?.close(), this.queue?.close()]);
  }
}
