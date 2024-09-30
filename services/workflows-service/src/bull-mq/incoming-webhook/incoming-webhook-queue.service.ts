import { Injectable } from '@nestjs/common';
import { BaseQueueService } from '@/bull-mq/base/base-queue.service';
import { IncomingWebhookData } from '@/bull-mq/incoming-webhook/types/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { QUEUES } from '@/bull-mq/consts';
import { Job } from 'bullmq';

@Injectable()
export class IncomingWebhookQueueService extends BaseQueueService<IncomingWebhookData> {
  constructor(protected readonly logger: AppLoggerService) {
    super(QUEUES.INCOMING_WEBHOOKS_QUEUE.name);
    this.initializeWorker();
  }

  async handleJob(job: Job<IncomingWebhookData>) {
    this.logger.log(`Processing webhook job ${job.id}`);

    const { service: workingService, payload } = job.data;
    // workingService.(payload)
  }

  protected initializeWorker() {
    super.initializeWorker();

    this.worker.on('completed', (job: Job) => {
      this.logger.log(`Outgoing Webhook job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, error, prev) => {
      this.logger.error(`Outgoing Webhook job ${job?.id} failed after retries: ${error.message}`);
    });

    this.queue.on('cleaned', (jobs, type) => {
      this.logger.log(
        `${jobs.length} ${type} Outgoing Webhook jobs have been cleaned from the webhook queue`,
      );
    });
  }
}
