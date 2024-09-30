import { Injectable } from '@nestjs/common';
import { BaseQueueService } from '@/bull-mq/base/base-queue.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { QUEUES } from '@/bull-mq/consts';
import { Job } from 'bullmq';
import axios, { HttpStatusCode } from 'axios';
import { isErrorWithMessage } from '@ballerine/common';
import { WebhookJobData } from '@/bull-mq/outgoing-webhook/types/types';

@Injectable()
export class OutgoingWebhookQueueService extends BaseQueueService<WebhookJobData> {
  constructor(protected readonly logger: AppLoggerService) {
    super(QUEUES.OUTGOING_WEBHOOKS_QUEUE.name);
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
    // Check if job has reached maximum attempts
    if (job.opts.attempts && job.attemptsMade >= job.opts.attempts) {
      this.logger.warn(`Job ${job.id} reached the maximum retry attempts (${job.opts.attempts})`);
      throw new Error(`Job ${job.id} failed after reaching max attempts`);
    }

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
    if (job.opts.attempts && job.attemptsMade >= job.opts.attempts) {
      this.logger.warn(
        `Job ${job.id} has reached the maximum number of attempts: ${job.opts.attempts}`,
      );

      return;
    }

    const delayMs = Math.pow(2, job.attemptsMade) * 1000 * job.attemptsMade;
    this.logger.log(`Retrying job ${job.id} with exponential backoff, delay: ${delayMs}ms`);

    await this.addJob(job.data, {
      delay: delayMs,
      attempts: job.opts.attempts,
    });
  }

  private async retryWithShortDelay(job: Job<WebhookJobData>) {
    if (job.opts.attempts && job.attemptsMade >= job.opts.attempts) {
      this.logger.warn(
        `Job ${job.id} has reached the maximum number of attempts: ${job.opts.attempts}`,
      );

      return;
    }

    const delayMs = 1000 * 60 * job.attemptsMade;
    this.logger.log(`Retrying job ${job.id} with short delay of ${delayMs / 1000} seconds`);

    await this.queue.add('webhook-job', job.data, {
      delay: delayMs,
      backoff: {
        type: 'fixed',
        delay: delayMs,
      },
      ...(job.opts.attempts ? { attempts: job.opts.attempts - 1 } : {}),
    });
  }

  protected initializeWorker() {
    super.initializeWorker();

    this.worker.on('completed', (job: Job) => {
      this.logger.log(`Webhook job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, error, prev) => {
      this.logger.error(`Webhook job ${job?.id} failed after retries: ${error.message}`);
    });

    this.queue.on('cleaned', (jobs, type) => {
      this.logger.log(`${jobs.length} ${type} jobs have been cleaned from the webhook queue`);
    });
  }
}
