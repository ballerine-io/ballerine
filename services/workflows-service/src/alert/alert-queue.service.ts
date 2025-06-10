import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Job } from 'bullmq';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { AlertService } from './alert.service';
import { QueueService } from '@/common/queue/queue.service';
import { QueueBullboardService } from '@/common/queue/queue-bullboard.service';
import { BullMQPrometheusService } from '@/common/monitoring/bullmq-prometheus.service';
import { BULLBOARD_INSTANCE_INJECTION_TOKEN } from '@/common/queue/types';
import type { BullBoardInjectedInstance } from '@/common/queue/types';

export interface AlertCheckJobData extends Record<string, unknown> {
  timestamp: number;
}

@Injectable()
export class AlertQueueService implements OnModuleInit {
  private readonly QUEUE_NAME = 'transaction-monitoring-alerts';
  private readonly SCHEDULER_ID = 'transaction-monitoring-alert-check';

  constructor(
    private readonly logger: AppLoggerService,
    private readonly alertService: AlertService,
    private readonly queueService: QueueService,
    private readonly queueBullboardService: QueueBullboardService,
    private readonly bullMQPrometheusService: BullMQPrometheusService,
    @Inject(BULLBOARD_INSTANCE_INJECTION_TOKEN)
    private bullBoard: BullBoardInjectedInstance,
  ) {}

  async onModuleInit() {
    await this.setupAlertQueue();
  }

  private async setupAlertQueue() {
    try {
      const queue = this.queueService.getQueue<AlertCheckJobData>({
        name: this.QUEUE_NAME,
        jobOptions: {
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 10_000,
          },
          removeOnComplete: { count: 100, age: 3600 * 24 },
          removeOnFail: false,
        },
      });

      this.bullMQPrometheusService.registerQueue(queue);

      if (this.queueService.isWorkerEnabled()) {
        this.queueBullboardService.registerQueue(this.bullBoard, queue);
      }

      await this.queueService.setupJobScheduler(queue, this.SCHEDULER_ID, {
        every: 60 * 60 * 1000,
        jobName: 'check-transaction-monitoring-alerts',
        data: { timestamp: Date.now() },
        jobOptions: {
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 10_000,
          },
        },
      });

      this.registerWorker();

      this.logger.log('Alert queue system setup complete');
    } catch (error) {
      this.logger.error('Failed to setup alert queue', { error });
    }
  }

  private registerWorker() {
    this.queueService.registerWorker<AlertCheckJobData>(
      this.QUEUE_NAME,
      async (job: Job<AlertCheckJobData>) => {
        this.logger.log('Processing transaction monitoring alerts check job', {
          jobId: job.id,
        });

        await this.alertService.checkAllAlerts();

        this.logger.log('Completed transaction monitoring alerts check', {
          jobId: job.id,
        });

        return { success: true, timestamp: Date.now() };
      },
      { concurrency: 1 },
    );
  }
}
