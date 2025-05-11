import { sign } from '@ballerine/common';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { isAxiosError, RawAxiosRequestHeaders } from 'axios';
import { ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';
import { RetryableQueue } from './retryable-queue';
import { BULLBOARD_INSTANCE_INJECTION_TOKEN, type BullBoardInjectedInstance } from './types/bull';
import { type OutgoingWebhookJobData, type OutgoingWebhookPayloads } from './types/webhook';

const captureWebhookFailureWithSentry = (errorPayload: Record<string, unknown>) => {
  Sentry.captureException(
    new Error('Failed to send a webhook', {
      cause: errorPayload,
    }),
    { extra: errorPayload },
  );
};
@Injectable()
export class WebhooksService {
  private queue: RetryableQueue<OutgoingWebhookJobData, string> | null = null;
  private notified = false;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly httpService: HttpService,
    @Inject(BULLBOARD_INSTANCE_INJECTION_TOKEN)
    private bullBoard: BullBoardInjectedInstance,
  ) {
    this.init();
  }

  private init() {
    const connection: ConnectionOptions = {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
    };

    if (!env.QUEUE_SYSTEM_ENABLED) {
      return;
    }

    const redis = new IORedis({
      ...connection,
      retryStrategy: () => 10_000,
      connectTimeout: 5_000,
      maxRetriesPerRequest: null,
    });

    redis.on('connect', () => {
      this.notified = false;
      this.logger.log('Redis connected.');
      this.setupQueues(redis);
    });

    redis.on('error', err => {
      this.degradeQueueSystem(err);
    });
  }

  private setupQueues(redis: IORedis) {
    if (this.queue) {
      return;
    }

    this.queue = new RetryableQueue<OutgoingWebhookJobData, string>(
      'outgoing-webhooks',
      {
        connection: redis,
        defaultJobOptions: { attempts: 5, backoff: { type: 'exponential', delay: 5_000 } },
        handlers: {
          handleJob: async job => {
            try {
              const res = await this.httpService.axiosRef.request(job.data);

              return res.data;
            } catch (error) {
              // Rethrow useful error data
              if (isAxiosError(error)) {
                throw error.response?.data ?? error;
              }
              throw error; // Ensure non-Axios errors are also rethrown
            }
          },
          handleDLQJob: async job => {
            this.logger.error('Failed to send webhook through queue system (now in DLQ).', {
              dlqJobId: job.id,
              originalJobId: job.data.originalJobContext.id,
              originalJobName: job.data.originalJobContext.name,
              originalQueueName: job.data.originalJobContext.queueName,
              errorDetails: job.data.error,
            });

            captureWebhookFailureWithSentry({
              dlqJobId: job.id,
              originalJobId: job.data.originalJobContext.id,
              originalJobName: job.data.originalJobContext.name,
              url: job.data.originalData.url,
              method: job.data.originalData.method,
              ...job.data.error,
            });

            this.logger.log('Further processing for DLQ job (e.g., custom notifications, saving state):', {
              originalData: job.data.originalData,
            });
          },
          onRetry: (job, err, attemptsLeft) => {
            this.logger.warn(`Failed to send webhook. Retrying... ${attemptsLeft} attempts left.`, {
              id: job.id,
              jobData: job.data,
              error: err,
            });
          },
        },
      },
      this.logger,
    );

    this.bullBoard.boardInstance.setQueues(
      [this.queue.queue, this.queue.dlq].map(queue => new BullMQAdapter(queue)),
    );

    this.logger.log('Queue system setup complete. (BullMQ)');
  }

  private async degradeQueueSystem(err?: Error) {
    if (!this.notified) {
      this.logger.log('Queue system in degraded mode due to Redis unavailability.', { err });
      this.notified = true;
    }

    try {
      await this.queue?.shutdown();
    } catch (shutdownErr) {
      this.logger.warn('Failed shutting down queue cleanly during degradation.', { shutdownErr });
    }

    this.queue = null;
    this.bullBoard.boardInstance.setQueues([]);
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

    if (this.queue && !forceDirect) {
      try {
        return await this.queue.queue.add(name, requestData);
      } catch (error) {
        // Enhanced logging and Sentry reporting for enqueue failure
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
          jobData: requestData, // Log the data that was supposed to be queued
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

      this.logger.error('Failed to send webhook', {
        id: runtimeData.id ?? id,
        error: errorPayload,
        state,
        entityId,
        correlationId,
      });

      captureWebhookFailureWithSentry(errorPayload);
    }
  }

  async onModuleDestroy() {
    await this.queue?.shutdown();
  }
}
