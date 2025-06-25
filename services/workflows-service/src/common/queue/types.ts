import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';

export const BULLBOARD_INSTANCE_INJECTION_TOKEN = 'BULLBOARD_INSTANCE';

export interface BullBoardInjectedInstance {
  boardInstance: ReturnType<typeof createBullBoard>;
  serverAdapter: ExpressAdapter;
}

export interface IQueueService {
  addJob<T = any>(queueName: string, job_name: string, data: T, opts?: any): Promise<any>;

  registerWorker<T = any>(
    queueName: string,
    processor: (job: any) => Promise<any>,
    options?: { concurrency?: number },
  ): void;

  isWorkerEnabled(): boolean;
  createQueue<T = any>(queueName: string, options?: QueueOptions<T>): void;
  setupJobScheduler<T = any>(
    queueName: string,
    schedulerId: string,
    scheduleOpts: { every: number },
    jobOpts: {
      name: string;
      data: T;
      opts?: any;
    },
  ): Promise<any>;
}

export interface QueueOptions<T = any> {
  name: string;
  concurrency?: number;
  jobOptions?: {
    attempts?: number;
    backoff?: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete?: boolean | number | { count: number; age: number };
    removeOnFail?: boolean | number | { count: number; age: number };
    priority?: number;
  };
}
