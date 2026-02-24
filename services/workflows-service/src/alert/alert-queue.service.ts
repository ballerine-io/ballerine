import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { AlertService } from './alert.service';
import type { IQueueService } from '@/common/queue/types';
import { env } from '@/env';

export interface AlertCheckJobData extends Record<string, unknown> {
  timestamp: number;
}

@Injectable()
export class AlertQueueService implements OnModuleInit {
  private readonly QUEUE_NAME = 'transaction-monitoring-alerts';
  private readonly SCHEDULER_ID = 'transaction-monitoring-alert-check';
  private readonly QUEUE_INIT_TIMEOUT_MS = 5_000;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly alertService: AlertService,
    @Inject('IQueueService') private readonly queueService: IQueueService,
  ) {}

  async onModuleInit() {
    if (!env.QUEUE_SYSTEM_ENABLED) {
      return;
    }

    // Do not block HTTP startup on Redis queue availability. If Redis is
    // temporarily unreachable during rollout, the service must still boot and
    // pass Cloud Run startup probes.
    void this.setupAlertQueueWithTimeout();
  }

  private async setupAlertQueueWithTimeout() {
    try {
      await Promise.race([
        this.setupAlertQueue(),
        new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('Alert queue setup timed out')),
            this.QUEUE_INIT_TIMEOUT_MS,
          );
        }),
      ]);
    } catch (error) {
      this.logger.warn('Alert queue initialization deferred; continuing service startup', {
        error,
      });
    }
  }

  private async setupAlertQueue() {
    try {
      await this.queueService.setupJobScheduler(
        this.QUEUE_NAME,
        this.SCHEDULER_ID,
        { every: 60 * 60 * 1000 },
        {
          name: 'alert-check',
          data: { timestamp: Date.now() },
        },
        {
          jobOptions: {
            attempts: 2,
            backoff: { type: 'exponential', delay: 10000 },
          },
        },
      );

      this.registerWorker();

      this.logger.log('Alert queue system setup complete');
    } catch (error) {
      this.logger.error('Failed to setup alert queue', { error });
    }
  }

  private registerWorker() {
    this.queueService.registerWorker(this.QUEUE_NAME, this.processAlertCheckJob.bind(this), {
      concurrency: 1,
    });
  }

  private async processAlertCheckJob(job: any) {
    this.logger.log('Processing transaction monitoring alerts check job', { jobId: job.id });
    try {
      await this.alertService.checkAllAlerts();
      this.logger.log('Completed transaction monitoring alerts check', { jobId: job.id });

      return { success: true, timestamp: Date.now() };
    } catch (error) {
      this.logger.error('Alert check job failed', { jobId: job.id, error });
      throw error;
    }
  }
}
