import { ConnectionOptions, DefaultJobOptions, Processor, Queue, Worker } from 'bullmq';

export class RetryableQueue<T extends Record<string, unknown> = any> {
  public queue: Queue<T>;
  public worker: Worker<T>;
  public dlq: Queue<T>;
  public dlqWorker: Worker<T>;

  constructor(
    queueName: string,
    options: {
      connection: ConnectionOptions;
      defaultJobOptions?: DefaultJobOptions;
      handlers: {
        handleJob: Processor<T, void, string>;
        handleDLQJob: Processor<T, void, string>;
      };
    },
  ) {
    const {
      connection,
      handlers,
      defaultJobOptions = { attempts: 3, backoff: { type: 'exponential', delay: 5_000 } },
    } = options;

    this.queue = new Queue(queueName, { connection, defaultJobOptions });
    this.dlq = new Queue(`${queueName}-dlq`, { connection });

    this.worker = new Worker(queueName, handlers.handleJob, { connection });
    this.dlqWorker = new Worker(`${queueName}-dlq`, handlers.handleDLQJob, { connection });

    this.worker.on('failed', async (job, err) => {
      if (!job) return;

      if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
        return await this.dlq.add(
          (job.id ?? `dlq-${Date.now()}`) as any,
          { ...job.data, error: err } as any,
        );
      }

      // if (!isRetryable || job.attemptsMade >= maxRetries) {
      //   return await this.dlq.add(
      //     (job.id ?? `dlq-${Date.now()}`) as any,
      //     { ...job.data, error: err } as any,
      //   );
      // }

      // return await job.moveToDelayed(Date.now() + Math.pow(2, job.attemptsMade + 1) * 1000);
    });
  }

  async shutdown(): Promise<void[]> {
    return Promise.all([
      this.queue.close(),
      this.worker.close(),
      this.dlq.close(),
      this.dlqWorker.close(),
    ]);
  }
}
