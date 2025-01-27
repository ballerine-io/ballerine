import { Injectable } from '@nestjs/common';
import { BaseQueueWorkerService } from '@/bull-mq/queues/base-queue-worker.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { QUEUES } from '@/bull-mq/consts';
import { Job } from 'bullmq';
import { TJobPayloadMetadata } from '@/bull-mq/types';

type TJobsWebhookIncoming = { jobData: IncomingWebhookData; metadata: TJobPayloadMetadata };
interface IncomingWebhookData {
  source: string;
  payload: Record<string, unknown>;
  service: (payload: Record<string, unknown>) => Promise<void>;
}

@Injectable()
export class IncomingWebhookQueueService extends BaseQueueWorkerService<IncomingWebhookData> {
  constructor(protected readonly logger: AppLoggerService) {
    super(QUEUES.INCOMING_WEBHOOKS_QUEUE.name, logger);
  }

  async handleJob(job: Job<TJobsWebhookIncoming>) {
    this.logger.log(`Processing webhook job ${job.id}`);

    const { service: workingService, payload } = job.data.jobData;
    //   TODO - handle the invoking webhook job internally
  }
}
