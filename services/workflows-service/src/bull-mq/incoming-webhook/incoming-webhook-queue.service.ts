import { Injectable } from '@nestjs/common';
import { BaseQueueWorkerService } from '@/bull-mq/base/base-queue-worker.service';
import { IncomingWebhookData } from '@/bull-mq/incoming-webhook/types/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { QUEUES } from '@/bull-mq/consts';
import { Job } from 'bullmq';

@Injectable()
export class IncomingWebhookQueueService extends BaseQueueWorkerService<IncomingWebhookData> {
  constructor(protected readonly logger: AppLoggerService) {
    super(QUEUES.INCOMING_WEBHOOKS_QUEUE.name, logger);
  }

  async handleJob(job: Job<IncomingWebhookData>) {
    this.logger.log(`Processing webhook job ${job.id}`);

    const { service: workingService, payload } = job.data;
    //   TODO - handle the invoking webhook job internally
  }
}
