import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';

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
    @InjectQueue(QUEUES.OUTGOING_WEBHOOKS_QUEUE.name) outgoingQueue: Queue,
    @InjectQueue(QUEUES.OUTGOING_WEBHOOKS_QUEUE.dlq) outgoingDLQ: Queue,
    protected readonly outgoingWebhookService: OutgoingWebhooksService,
    protected readonly logger: AppLoggerService,
    protected readonly config: ConfigService,
  ) {
    super(outgoingQueue, outgoingDLQ, logger, config);
  }

  async handleJob(job: Job<TJobArgs>) {
    await this.outgoingWebhookService.invokeWebhook(job.data.jobData);
  }
}
