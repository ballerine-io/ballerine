import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';

import { QUEUES } from '@/bull-mq/consts';
import { BaseQueueWorkerService } from '@/bull-mq/queues/base-queue-worker.service';
import { TJobPayloadMetadata } from '@/bull-mq/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { OutgoingWebhooksService } from '@/webhooks/outgoing-webhooks/outgoing-webhooks.service';

type WebhookJobData = Parameters<OutgoingWebhooksService['invokeWebhook']>[0];
type TJobArgs = { jobData: WebhookJobData; metadata: TJobPayloadMetadata };

@Injectable()
export class OutgoingWebhookQueueService extends BaseQueueWorkerService<WebhookJobData> {
  constructor(
    protected readonly logger: AppLoggerService,
    protected outgoingWebhookService: OutgoingWebhooksService,
  ) {
    super(QUEUES.OUTGOING_WEBHOOKS_QUEUE.name, logger);
    this.initializeWorker();
  }

  async handleJob(job: Job<TJobArgs>) {
    await this.outgoingWebhookService.invokeWebhook(job.data.jobData);
  }
}
