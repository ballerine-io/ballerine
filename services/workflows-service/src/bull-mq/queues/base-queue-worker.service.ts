import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue, QueueListener, Worker } from 'bullmq';
import { WorkerListener } from 'bullmq/dist/esm/classes/worker';
import { randomUUID } from 'node:crypto';

import { TJobPayloadMetadata } from '@/bull-mq/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export abstract class BaseQueueWorkerService<T = unknown> implements OnModuleDestroy, OnModuleInit {
  protected worker?: Worker;

  protected constructor(
    protected readonly queue: Queue,
    protected readonly deadLetterQueue: Queue,
    protected readonly logger: AppLoggerService,
    protected readonly configService: ConfigService,
  ) {
    if (!this.configService.get('QUEUE_SYSTEM_ENABLED')) {
      return;
    }

    this.initializeWorker();
  }

  abstract handleJob(job: Job<{ jobData: T; metadata: TJobPayloadMetadata }>): Promise<void>;

  async addJob(jobData: T, metadata: TJobPayloadMetadata = {}, jobOptions = {}): Promise<void> {
    await this.queue?.add(randomUUID(), { metadata, jobData }, jobOptions);
  }

  protected initializeWorker() {
    this.worker = new Worker(this.queue.name, this.handleJob.bind(this), {
      connection: {
        host: this.configService.get('REDIS_HOST'),
        port: this.configService.get('REDIS_PORT'),
        password: this.configService.get('REDIS_PASSWORD'),
      },
    });

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
      listener: async job => {
        if (!job?.opts.attempts || job.attemptsMade < job.opts.attempts) return;

        this.logger.error(`Job ${job?.id} failed permanently. Moving to DLQ.`);
        await this.deadLetterQueue.add(randomUUID(), job?.data);
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

  protected setQueueListener<T extends keyof QueueListener<unknown, unknown, string>>({
    queue,
    eventName,
    listener,
  }: {
    queue: Queue | undefined;
    eventName: T;
    listener: QueueListener<unknown, unknown, string>[T];
  }) {
    queue?.removeAllListeners(eventName);
    queue?.on(eventName, listener);
  }

  async onModuleDestroy() {
    await this.queue?.pause();
    await Promise.all([this.worker?.close(), this.queue?.close()]);

    this.logger.log(`Queue ${this.queue.name} is paused and closed`);
  }

  async onModuleInit() {
    if (this.queue) {
      const isPaused = await this.queue.isPaused();

      if (isPaused) {
        await this.queue.resume();
      }

      const isPausedAfterResume = await this.queue?.isPaused();

      if (isPausedAfterResume) {
        this.logger.error(`Queue ${this.queue.name} is still paused after trying to resume it`);
      }
    }
  }
}
