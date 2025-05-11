import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';
import {
  ConnectionOptions,
  DefaultJobOptions,
  Job,
  Processor,
  Queue,
  Worker,
  WorkerOptions,
} from 'bullmq';
import { BullMQOtel } from 'bullmq-otel';

// New structured type for DLQ job data
interface OriginalJobInfo<N extends string = string> {
  id?: string; // Original job ID
  name: N; // Original job name
  queueName: string; // Original queue name
}

// Redefined DLQJobData
export type DLQJobData<T extends Record<string, unknown> = any, N extends string = string> = {
  originalJobContext: OriginalJobInfo<N>;
  originalData: T;
  error: { message: string; stack?: string; name?: string };
};

export class RetryableQueue<
  T extends Record<string, unknown> = any,
  N extends string = string
> {
  public queue: Queue<T, void, N>;
  public worker: Worker<T, void, N> | null = null;
  public dlq: Queue<DLQJobData<T, N>, void, 'failedJob'>; // Using 'failedJob' as the job name for DLQ
  public dlqWorker: Worker<DLQJobData<T, N>, void, 'failedJob'> | null = null;

  constructor(
    private readonly queueName: string, // Store queueName for DLQ context
    options: {
      connection: ConnectionOptions;
      defaultJobOptions?: DefaultJobOptions;
      handlers: {
        handleJob: Processor<T, void, N>;
        handleDLQJob: Processor<DLQJobData<T, N>, void, 'failedJob'>;
        onRetry?: (job: Job<T, void, N>, err: Error, attemptsLeft: number) => void;
      };
      workerOptions?: WorkerOptions;
    },
    private readonly logger: AppLoggerService,
  ) {
    this.logger.log('Creating queue', { queueName: this.queueName });
    const {
      connection,
      handlers,
      defaultJobOptions = { attempts: 3, backoff: { type: 'exponential', delay: 5_000 } },
      workerOptions = {} as WorkerOptions,
    } = options;

    // Sensible defaults for job retention to prevent Redis memory issues
    // These can be overridden by the consuming service if specific retention is needed.
    const effectiveDefaultJobOptions: DefaultJobOptions = {
      removeOnComplete: { count: 1000, age: 3600 * 24 * 7 }, // Keep completed for 7 days or 1000 jobs
      removeOnFail: true, // Remove from main queue if it failed all attempts (as it goes to DLQ)
      ...defaultJobOptions, // User-provided options take precedence
    };

    const telemetry = new BullMQOtel(`workflows-service-${this.queueName}`);

    this.queue = new Queue<T, void, N>(this.queueName, {
      connection,
      defaultJobOptions: effectiveDefaultJobOptions,
      telemetry,
    });

    // Keep DLQ jobs finite so Redis doesn't grow unbounded
    const dlqDefaultJobOptions: DefaultJobOptions = {
      removeOnComplete: { count: 10_000, age: 60 * 60 * 24 * 30 }, // 30 days or 10k jobs
      removeOnFail: false,
    };

    this.dlq = new Queue<DLQJobData<T, N>, void, 'failedJob'>(`${this.queueName}-dlq`, {
      connection,
      defaultJobOptions: dlqDefaultJobOptions,
      telemetry,
    });

    if (env.IS_QUEUE_WORKER) {
      this.logger.log('Creating worker for queue', { queueName: this.queueName });
      const workerConcurrency = workerOptions?.concurrency ?? 20; // sensible default

      const mergedWorkerOptions: WorkerOptions = {
        ...workerOptions,
        connection,
        concurrency: workerConcurrency,
        telemetry,
      };

      this.worker = new Worker<T, void, N>(this.queueName, handlers.handleJob, mergedWorkerOptions);

      this.dlqWorker = new Worker<DLQJobData<T, N>, void, 'failedJob'>(
        `${this.queueName}-dlq`,
        handlers.handleDLQJob,
        mergedWorkerOptions,
      );

      this.worker.on('failed', async (job, error) => {
        if (!job) {
          this.logger.error('Job is undefined in failed event for queue', { queueName: this.queueName, error });
          return;
        }

        const attemptsLeft = (job.opts.attempts ?? 1) - job.attemptsMade;

        this.logger.error('Job failed', {
          queueName: this.queueName,
          jobId: job.id,
          jobName: job.name,
          attemptsMade: job.attemptsMade,
          attemptsLeft,
          error: { message: error.message, stack: error.stack, name: error.name },
        });

        if (attemptsLeft <= 0) {
          const dlqJobId = job.id ? `dlq-${job.id}` : `dlq-${this.queueName}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
          const dlqPayload: DLQJobData<T, N> = {
            originalJobContext: {
              id: job.id,
              name: job.name,
              queueName: this.queueName,
            },
            originalData: job.data,
            error: { message: error.message, stack: error.stack, name: error.name },
          };

          try {
            await this.dlq.add(
              'failedJob', // Consistent job name for DLQ entries
              dlqPayload,
              { jobId: dlqJobId },
            );
            this.logger.error('Moved job to DLQ', { queueName: this.queueName, originalJobId: job.id, dlqJobId });
          } catch (dlqError) {
            // CRITICAL: Failed to add job to DLQ. Log entire payload for manual recovery.
            this.logger.error(
              'CRITICAL: FAILED TO ADD JOB TO DLQ. Manual recovery may be needed. Logging job details.',
              {
                queueName: this.queueName,
                originalJobId: job.id,
                originalJobName: job.name,
                dlqPayload, // Log the full payload
                dlqError: {
                  message: (dlqError as Error).message,
                  stack: (dlqError as Error).stack,
                  name: (dlqError as Error).name,
                },
              },
            );
          }
          return;
        }

        handlers.onRetry?.(job, error, attemptsLeft);
      });
    }
  }

  async shutdown(): Promise<void[]> {
    return Promise.all([
      this.queue.close(),
      ...(this.worker ? [this.worker.close()] : []),
      this.dlq.close(),
      ...(this.dlqWorker ? [this.dlqWorker.close()] : []),
    ]);
  }
}
