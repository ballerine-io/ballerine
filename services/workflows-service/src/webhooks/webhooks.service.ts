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

export const alertWebhookFailure = (errorPayload: Record<string, unknown>) => {
  Sentry.captureException(
    new Error('Failed to send a webhook', {
      cause: errorPayload,
    }),
    { extra: errorPayload },
  );
};

@Injectable()
export class WebhooksService {
  private queue: RetryableQueue | null = null;

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
      this.setupQueues(redis);
    });

    redis.on('error', err => {
      this.degradeQueueSystem(err);
    });
  }

  private setupQueues(redis: IORedis) {
    this.queue = new RetryableQueue<OutgoingWebhookJobData>('outgoing-webhooks', {
      connection: redis,
      defaultJobOptions: { attempts: 2, backoff: { type: 'exponential', delay: 5_000 } },
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
          }
        },
        handleDLQJob: async job => {
          this.logger.error('Failed to send webhook through queue system.', {
            id: job.id,
            jobData: job.data,
            error: job.data.error,
          });

          alertWebhookFailure({ ...job.data.error, url: job.data.url, method: job.data.method });

          // Process unsent data
          // ...
        },
        onRetry: (job, err, attemptsLeft) => {
          this.logger.warn(`Failed to send webhook. Retrying... ${attemptsLeft} attempts left.`, {
            id: job.id,
            jobData: job.data,
            error: err,
          });
        },
      },
    });

    this.bullBoard.boardInstance.setQueues(
      [this.queue.queue, this.queue.dlq].map(queue => new BullMQAdapter(queue)),
    );
  }

  private degradeQueueSystem(err?: Error) {
    this.logger.log('Queue system in degraded mode due to Redis unavailability.', { err });

    this.queue = null;
    this.bullBoard.boardInstance.setQueues([]);
  }

  async invokeWebhook<T extends keyof OutgoingWebhookPayloads>(
    name: T,
    config: OutgoingWebhookJobData,
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

    if (this.queue) {
      try {
        return await this.queue.queue.add(name, requestData);
      } catch (error) {
        this.logger.error('Failed to add webhook job to the queue:: ', { error });
        this.logger.log('Attempting to send the request directly...');
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

      alertWebhookFailure(errorPayload);
    }
  }

  async onModuleDestroy() {
    await this.queue?.shutdown();
  }
}
