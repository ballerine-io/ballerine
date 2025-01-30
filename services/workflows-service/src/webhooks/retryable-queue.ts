import { ConnectionOptions, Processor, Queue, Worker } from 'bullmq';

export type RetryableQueueData = {
  maxRetries: number;
  isRetryable?: boolean;
};

export class RetryableQueue<T extends Record<string, unknown> = any> {
  public queue: Queue<T>;
  public worker: Worker<T & RetryableQueueData>;
  public dlq: Queue<T>;
  public dlqWorker: Worker<T & RetryableQueueData>;

  constructor(
    queueName: string,
    options: RetryableQueueData & {
      connection: ConnectionOptions;
      handlers: {
        handleJob: Processor<T & RetryableQueueData, void, string>;
        handleDLQJob: Processor<T & RetryableQueueData, void, string>;
      };
    },
  ) {
    const { connection, handlers } = options;

    this.queue = new Queue(queueName, { connection });
    this.dlq = new Queue(`${queueName}-dlq`, { connection });

    this.worker = new Worker(queueName, handlers.handleJob, { connection });
    this.dlqWorker = new Worker(`${queueName}-dlq`, handlers.handleDLQJob, { connection });

    this.worker.on('failed', async (job, err) => {
      if (!job) return;

      const { maxRetries, isRetryable = true } = job.data;

      if (!isRetryable || job.attemptsMade >= maxRetries) {
        return await this.dlq.add(
          (job.id ?? `dlq-${Date.now()}`) as any,
          { ...job.data, error: err } as any,
        );
      }

      // return await job.moveToDelayed(Date.now() + Math.pow(2, job.attemptsMade + 1) * 1000);
    });
  }

  async shutdown(): Promise<void> {
    await Promise.all([
      this.queue.close(),
      this.worker.close(),
      this.dlq.close(),
      this.dlqWorker.close(),
    ]);
  }
}
