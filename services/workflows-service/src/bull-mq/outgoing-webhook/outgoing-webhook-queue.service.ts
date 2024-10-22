import { Injectable } from '@nestjs/common';
import { BaseQueueWorkerService } from '@/bull-mq/base/base-queue-worker.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { QUEUES } from '@/bull-mq/consts';
import { Job } from 'bullmq';
import { HttpStatusCode } from 'axios';
import { WebhookJobData } from '@/bull-mq/outgoing-webhook/types/types';
import { OutgoingWebhooksService } from '@/webhooks/outgoing-webhooks/outgoing-webhooks.service';
import { TJobPayloadMetadata } from '@/bull-mq/types';

type TJobArgs = { jobData: WebhookJobData; metadata: TJobPayloadMetadata };

@Injectable()
export class OutgoingWebhookQueueService extends BaseQueueWorkerService<WebhookJobData> {
  constructor(
    protected readonly logger: AppLoggerService,
    protected webhookService: OutgoingWebhooksService,
  ) {
    super(QUEUES.OUTGOING_WEBHOOKS_QUEUE.name, logger);
    this.initializeWorker();
  }

  async handleJob(job: Job<TJobArgs>) {
    this.logger.log(`Processing webhook job ${job.id}`);

    const response = await this.webhookService.invokeWebhook({
      ...job.data.jobData,
    });

    this.logger.log(`Webhook job ${job.id} completed with status: ${response.status}`);

    if (response.status >= 200 && response.status < 300) {
      return;
    }

    await this.handleRetryStrategy(response.status, job);
  }

  private async handleRetryStrategy(status: number, job: Job<TJobArgs>) {
    if (job.opts.attempts && job.attemptsMade >= job.opts.attempts) {
      this.logger.warn(`Job ${job.id} reached the maximum retry attempts (${job.opts.attempts})`);
      throw new Error(`Job ${job.id} failed after reaching max attempts`);
    }

    let delayMs: number;

    switch (status) {
      case HttpStatusCode.TooManyRequests:
      case HttpStatusCode.InternalServerError:
      case HttpStatusCode.BadGateway:
      case HttpStatusCode.ServiceUnavailable:
      case HttpStatusCode.GatewayTimeout:
        delayMs = Math.pow(2, job.attemptsMade + 1) * 1000; // Exponential backoff
        break;

      case HttpStatusCode.RequestTimeout:
        delayMs = 1000 * 60 * (job.attemptsMade + 1); // Linear backoff in minutes
        break;

      case HttpStatusCode.BadRequest:
        throw new Error(`Webhook job failed with status ${status}: Bad Request`);

      default:
        throw new Error(`Webhook job failed with status ${status}: Unexpected Error`);
    }

    await this.retryJob(job, delayMs);
  }

  private async retryJob(job: Job<TJobArgs>, delayMs: number) {
    const nextAttempt = job.attemptsMade + 1;
    this.logger.log(
      `Scheduling retry for job ${job.id}. Next attempt: ${nextAttempt}, delay: ${delayMs}ms`,
    );

    await job.updateProgress(nextAttempt);
    await job.moveToDelayed(Date.now() + delayMs);
  }
}
