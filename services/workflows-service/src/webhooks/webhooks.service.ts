import { sign } from '@ballerine/common';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import axios, { isAxiosError, RawAxiosRequestHeaders } from 'axios';
import { ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';
import { RetryableQueue } from './retryable-queue';
import { BULLBOARD_INSTANCE_INJECTION_TOKEN, type BullBoardInjectedInstance } from './types/bull';
import { type OutgoingWebhookJobData, type OutgoingWebhookPayloads } from './types/webhook';

export const alertWebhookFailure = (error: unknown) => {
  const errorToAlert = new Error('Failed to send a webhook', { cause: error });
  const context = isAxiosError(error) ? { ...error } : {};

  Sentry.captureException(errorToAlert, {
    extra: context,
  });
};

@Injectable()
export class WebhooksService {
  private readonly queues = new Map<string, RetryableQueue>();
  private isRedisActive = false;

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
      this.isRedisActive = true;
      this.setupQueues(redis);
    });

    redis.on('error', err => {
      this.isRedisActive = false;
      this.degradeQueueSystem(err);
    });
  }

  private setupQueues(redis: IORedis) {
    this.queues.set(
      'outgoing',
      new RetryableQueue<OutgoingWebhookJobData>('outgoing-webhooks', {
        connection: redis,
        handlers: {
          handleJob: async job => {
            this.logger.log(`Processing outgoing webhook job ${job.id}`, {
              url: job.data.url,
              method: job.data.method,
            });

            return this.httpService.axiosRef.request(job.data);
          },
          handleDLQJob: async (job, err) => {
            this.logger.error(
              'Failed to send webhook through queue system. Processing dead letter queue.',
              { id: job.id, jobData: job.data, error: err },
            );

            alertWebhookFailure(err);

            // Process unsent data
            // ...
          },
        },
      }),
    );

    this.bullBoard.boardInstance.setQueues(
      Array.from(this.queues.values())
        .flatMap(queue => [queue.queue, queue.dlq])
        .map(queue => new BullMQAdapter(queue)),
    );
  }

  private degradeQueueSystem(err?: Error) {
    // We can add some fallback behavior here if Redis goes down
    this.logger.log('Queue system in degraded mode due to Redis unavailability.', { err });
  }

  async invokeWebhook<T extends keyof OutgoingWebhookPayloads>(
    name: T,
    config: OutgoingWebhookJobData,
  ) {
    const { url, method, headers: defaultHeaders, data, secret, timeout } = config;

    const headers: RawAxiosRequestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...defaultHeaders,
    };

    if (data && secret) {
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

    const queue = this.queues.get('outgoing');

    if (this.isRedisActive && queue) {
      try {
        return await queue.queue.add(name, requestData);
      } catch (error) {
        this.logger.log('Failed to add webhook job to the queue::  ', { error });

        return null;
      }
    }

    try {
      return await axios(requestData);
    } catch (error) {
      const { id, state, entityId, correlationId, runtimeData } = data as Record<string, any>;

      this.logger.error('Failed to send webhook', {
        id,
        message: isAxiosError(error)
          ? error.response?.data ?? error.message
          : (error as Error).message,
        error,
      });

      this.logger.log('Webhook error data::  ', {
        state: state,
        entityId: entityId,
        correlationId: correlationId,
        id: runtimeData.id,
      });

      alertWebhookFailure(error);

      return null;
    }
  }

  async onModuleDestroy() {
    await Promise.allSettled(Array.from(this.queues.values()).map(queue => queue.shutdown()));
  }
}
