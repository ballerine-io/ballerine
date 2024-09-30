import { Injectable } from '@nestjs/common';
import { BaseQueueService } from '@/bull-mq/base/base-queue.service';
import { WebhookJobData } from '@/bull-mq/incoming-webhook/types/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { QUEUES } from '@/bull-mq/consts';
import { Job } from 'bullmq';
import axios, { HttpStatusCode } from 'axios';
import { isErrorWithMessage } from '@ballerine/common';

@Injectable()
export class IncomingWebhookQueueService extends BaseQueueService<WebhookJobData> {
  constructor(protected readonly logger: AppLoggerService) {
    super(QUEUES.INCOMING_WEBHOOKS_QUEUE.name);
    this.initializeWorker();
  }

  async handleJob(job: Job<WebhookJobData>) {
    this.logger.log(`Processing webhook job ${job.id}`);

    const { url, method, headers, body, timeout } = job.data;

    try {
      const response = await axios({
        url,
        method,
        headers,
        data: body,
        timeout: timeout || 15000,
      });

      this.logger.log(`Webhook job ${job.id} completed with status: ${response.status}`);

      await this.handleRetryStrategy(response.status, job);
    } catch (error) {
      this.logger.error(
        `Webhook job ${job.id} failed: ${isErrorWithMessage(error) && error.message}`,
      );
      throw error;
    }
  }

  private async handleRetryStrategy(status: number, job: Job<WebhookJobData>) {
    switch (status) {
      case HttpStatusCode.TooManyRequests:
      case HttpStatusCode.InternalServerError:
      case HttpStatusCode.BadGateway:
      case HttpStatusCode.ServiceUnavailable:
      case HttpStatusCode.GatewayTimeout:
        await this.retryWithExponentialBackoff(job);
        break;

      case HttpStatusCode.RequestTimeout:
        await this.retryWithShortDelay(job);
        break;

      case HttpStatusCode.BadRequest:
        throw new Error(`Webhook job failed with status ${status}: Bad Request`);

      default:
        throw new Error(`Webhook job failed with status ${status}: Unexpected Error`);
    }
  }

  private async retryWithExponentialBackoff(job: Job<WebhookJobData>) {
    const delayMs = Math.pow(2, job.attemptsMade) * 1000; // Exponential backoff delay
    this.logger.log(`Retrying job ${job.id} with exponential backoff, delay: ${delayMs}ms`);

    // Requeue the job with exponential backoff
    await this.queue.add('webhook-job', job.data, {
      delay: delayMs, // Delay in milliseconds
      attempts: 5, // Maximum retry attempts
      backoff: {
        type: 'exponential', // Exponential backoff for retries
        delay: 1000,
      },
    });
  }

  private async retryWithShortDelay(job: Job<WebhookJobData>) {
    const delayMs = 1000 * 60; // 1 minute delay
    this.logger.log(`Retrying job ${job.id} with short delay of ${delayMs / 1000} seconds`);

    await this.queue.add('webhook-job', job.data, {
      delay: delayMs,
      attempts: 5,
      backoff: {
        type: 'fixed',
        delay: delayMs,
      },
    });
  }

  protected initializeWorker() {
    super.initializeWorker();

    this.worker.on('completed', (job: Job) => {
      this.logger.log(`Webhook job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, error, prev) => {
      this.logger.error(`Webhook job ${job.id} failed after retries: ${error.message}`);
    });

    this.queue.on('cleaned', (jobs, type) => {
      this.logger.log(`${jobs.length} ${type} jobs have been cleaned from the webhook queue`);
    });
  }
}
