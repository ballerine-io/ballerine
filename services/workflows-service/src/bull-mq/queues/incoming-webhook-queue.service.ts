import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';

import { QUEUES } from '@/bull-mq/consts';
import { BaseQueueWorkerService } from '@/bull-mq/queues/base-queue-worker.service';
import { TJobPayloadMetadata } from '@/bull-mq/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
// import { IncomingWebhooksService } from '@/webhooks/incoming/incoming-webhooks.service';

type TJobsWebhookIncoming = { jobData: IncomingWebhookData; metadata: TJobPayloadMetadata };
interface IncomingWebhookData {
  source: string;
  payload: Record<string, unknown>;
  service: (payload: Record<string, unknown>) => Promise<void>;
}

@Injectable()
export class IncomingWebhookQueueService extends BaseQueueWorkerService<IncomingWebhookData> {
  constructor(
    @InjectQueue(QUEUES.INCOMING_WEBHOOKS_QUEUE.name) incomingQueue: Queue,
    @InjectQueue(QUEUES.INCOMING_WEBHOOKS_QUEUE.dlq) incomingDLQ: Queue,
    // circular dep
    // protected readonly incomingWebhookService: IncomingWebhooksService,
    protected readonly logger: AppLoggerService,
    protected readonly config: ConfigService,
  ) {
    super(incomingQueue, incomingDLQ, logger, config);
  }

  async handleJob(job: Job<TJobsWebhookIncoming>) {
    this.logger.log(`Processing webhook job ${job.id}`);

    const { service: workingService, payload } = job.data.jobData;
    //   TODO - handle the invoking webhook job internally
  }
}
