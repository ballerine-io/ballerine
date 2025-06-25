import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import type { QueueOptions } from './queue.service';

export const BULLBOARD_INSTANCE_INJECTION_TOKEN = 'BULLBOARD_INSTANCE';

export interface BullBoardInjectedInstance {
  boardInstance: ReturnType<typeof createBullBoard>;
  serverAdapter: ExpressAdapter;
}
export interface IQueueService {
  /**
   * Add a job to the queue.
   */
  addJob<T = any>(queueName: string, data: T, opts?: any): Promise<any>;

  /**
   * Register a worker for a queue. The processor should be a standalone function for testability and abstraction.
   */
  registerWorker<T = any>(
    queueName: string,
    processor: (job: any) => Promise<any>,
    options?: { concurrency?: number },
  ): void;

  isWorkerEnabled(): boolean;

  /**
   * Explicitly create/configure a queue with options.
   */
  createQueue<T = any>(queueName: string, options?: QueueOptions<T>): void;
}
