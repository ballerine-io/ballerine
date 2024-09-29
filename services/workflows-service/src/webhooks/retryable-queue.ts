import { ConnectionOptions, DefaultJobOptions, Job, Processor, Queue, Worker } from 'bullmq';

export class RetryableQueue<T extends Record<string, unknown> = any> {
  public queue: Queue<T>;
  public worker: Worker<T>;
  public dlq: Queue;
  public dlqWorker: Worker;

  constructor(
    queueName: string,
    options: {
      connection: ConnectionOptions;
      defaultJobOptions?: DefaultJobOptions;
      handlers: {
        handleJob: Processor<T, void, string>;
        handleDLQJob: Processor<T & { error: Error }, void, string>;
        onRetry?: (job: Job<T, void, string>, err: Error, attemptsLeft: number) => void;
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

    this.worker.on('failed', async (job, error) => {
      if (!job) {
        return;
      }

      const attemptsLeft = (job.opts.attempts ?? 1) - job.attemptsMade;

      if (attemptsLeft <= 0) {
        return await this.dlq.add(job.id ?? `dlq-${Date.now()}`, { ...job.data, error });
      }

      handlers.onRetry?.(job, error, attemptsLeft);
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
