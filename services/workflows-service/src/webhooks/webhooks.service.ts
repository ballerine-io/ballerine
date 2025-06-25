import { sign } from '@ballerine/common';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { isAxiosError, RawAxiosRequestHeaders } from 'axios';
import { Job } from 'bullmq';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { BULLBOARD_INSTANCE_INJECTION_TOKEN } from '@/common/queue/types';
import type { BullBoardInjectedInstance, IQueueService } from '@/common/queue/types';
import { env } from '@/env';
import {
  WebhookError,
  type OutgoingWebhookJobData,
  type OutgoingWebhookPayloads,
} from './types/webhook';

const captureWebhookFailureWithSentry = (errorPayload: Record<string, unknown>) => {
  Sentry.captureException(
    new Error('Failed to send a webhook', {
      cause: errorPayload,
    }),
    { extra: errorPayload },
  );
};

@Injectable()
export class WebhooksService implements OnModuleInit {
  private readonly QUEUE_NAME = 'outgoing-webhooks';
  private queueInitialized = false;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly httpService: HttpService,
    @Inject('IQueueService') private readonly queueService: IQueueService,
    @Inject(BULLBOARD_INSTANCE_INJECTION_TOKEN)
    private bullBoard: BullBoardInjectedInstance,
  ) {
    this.logger.log('WebhooksService constructor');
  }

  async onModuleInit() {
    this.logger.log('WebhooksService onModuleInit');

    if (!env.QUEUE_SYSTEM_ENABLED) {
      this.logger.log('Queue system is disabled. Webhooks will be sent directly.');

      return;
    }

    this.logger.log(
      `Setting up queue system. env.QUEUE_SYSTEM_ENABLED: ${env.QUEUE_SYSTEM_ENABLED}`,
    );
    await this.setupQueueSystem();
  }

  private async setupQueueSystem() {
    try {
      this.queueService.createQueue<OutgoingWebhookJobData>(this.QUEUE_NAME, {
        name: this.QUEUE_NAME,
        jobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: { count: 1000, age: 3600 * 24 * 7 },
          removeOnFail: false,
        },
      });

      this.registerWorker();

      this.queueInitialized = true;
      this.logger.log('Webhook queue system setup complete');
    } catch (error) {
      this.logger.error('Failed to initialize webhook queue system', { error });
      this.queueInitialized = false;
    }
  }

  private registerWorker() {
    this.queueService.registerWorker<OutgoingWebhookJobData>(
      this.QUEUE_NAME,
      this.processWebhookJob.bind(this),
      { concurrency: 10 },
    );
  }

  private async processWebhookJob(job: Job<OutgoingWebhookJobData>) {
    try {
      const res = await this.httpService.axiosRef.request(job.data);

      return res.data;
    } catch (error) {
      this.handleWebhookJobError(job, error);

      if (isAxiosError(error)) {
        const webhookError = new WebhookError('Webhook request failed');
        webhookError.cause = error;
        webhookError.statusCode = error.response?.status;
        webhookError.responseData = error.response?.data;
        webhookError.headers = error.response?.headers;
        throw webhookError;
      }

      throw error;
    }
  }

  private handleWebhookJobError(job: Job<OutgoingWebhookJobData>, error: any) {
    const isLastAttempt = job.attemptsMade >= (job.opts.attempts || 1);

    if (isLastAttempt) {
      this.logger.error('Final webhook delivery attempt failed, giving up', {
        jobId: job.id,
        jobName: job.name,
        url: job.data.url,
        method: job.data.method,
        attempts: job.attemptsMade,
        error: isAxiosError(error)
          ? {
              response: error.response?.data,
              status: error.response?.status,
              message: error.message,
            }
          : error,
      });

      captureWebhookFailureWithSentry({
        jobId: job.id,
        jobName: job.name,
        url: job.data.url,
        method: job.data.method,
        error: isAxiosError(error)
          ? {
              response: error.response?.data,
              status: error.response?.status,
              message: error.message,
            }
          : error,
      });
    } else {
      this.logger.warn(
        `Failed to send webhook. Will retry, ${
          (job.opts.attempts || 1) - job.attemptsMade
        } attempts left`,
        {
          jobId: job.id,
          url: job.data.url,
          method: job.data.method,
          error: isAxiosError(error) ? error.message : error,
        },
      );
    }
  }

  async invokeWebhook<T extends keyof OutgoingWebhookPayloads>(
    name: T,
    config: OutgoingWebhookJobData,
    forceDirect?: boolean,
  ) {
    const { url, method, headers: argHeaders, data, secret, timeout } = config;

    this.logger.log('Sending webhook...', { url, method });

    const headers: RawAxiosRequestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...argHeaders,
    };

    if (!secret) {
      this.logger.warn('Secret is missing when sending a webhook', { url, method });
    } else if (data) {
      headers['X-Authorization'] = secret;
      headers['X-HMAC-Signature'] = sign({ payload: data, key: secret });
    }

    const requestData: OutgoingWebhookJobData = {
      url,
      method,
      headers,
      data,
      timeout: timeout ?? 15_000,
    };

    if (env.QUEUE_SYSTEM_ENABLED && this.queueInitialized && !forceDirect) {
      try {
        return await this.queueService.addJob(this.QUEUE_NAME, name, requestData);
      } catch (error) {
        const enqueueErrorPayload = {
          message: 'Failed to add webhook job to the queue',
          jobName: name,
          url: requestData.url,
          method: requestData.method,
          originalError: {
            message: (error as Error).message,
            stack: (error as Error).stack,
            name: (error as Error).name,
          },
          jobData: requestData,
        };

        this.logger.error(
          'CRITICAL: Failed to add webhook job to the queue. Attempting direct send as fallback.',
          enqueueErrorPayload,
        );
        Sentry.captureException(new Error(enqueueErrorPayload.message, { cause: error }), {
          extra: enqueueErrorPayload,
          tags: { failureType: 'enqueue_failure' },
        });

        this.logger.log('Attempting to send the request directly after enqueue failure...');
      }
    }

    try {
      return await this.httpService.axiosRef.request(requestData);
    } catch (error) {
      const { id, state, entityId, correlationId, runtimeData } = data as Record<string, any>;

      const errorPayload = { ...(isAxiosError(error) ? error.response?.data : error), url, method };

      this.logger.error('Failed to send webhook directly', {
        id: runtimeData?.id ?? id,
        error: errorPayload,
        state,
        entityId,
        correlationId,
      });

      captureWebhookFailureWithSentry(errorPayload);
    }
  }
}
