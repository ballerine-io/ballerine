import { sign } from '@ballerine/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import axios, { isAxiosError, RawAxiosRequestHeaders } from 'axios';
import { ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';
import { RetryableQueue } from './retryable-queue';

type BaseOutgoingWebhookPayload = {
  id: string;
  apiVersion: string;
  timestamp: string;
  workflowCreatedAt: Date;
  workflowResolvedAt: Date | null;
  workflowDefinitionId: string;
  workflowRuntimeId: string;
  ballerineEntityId: string;
  correlationId: string;
  environment: string | undefined;
  data: Record<string, any>;
};

type OutgoingWebhookPayloads = {
  'workflow.completed': BaseOutgoingWebhookPayload & {
    eventName: 'workflow.completed';
  };
  'workflow.state.changed': BaseOutgoingWebhookPayload & {
    state: string | null;
    eventName: 'workflow.state.changed';
  };
  'workflow.context.document.changed': BaseOutgoingWebhookPayload;
  'user-created-outgoing': { userId: string };
  'website-validation-finished': { processId: string };
};

type OutgoingWebhookJobData = {
  url: string;
  method: string;
  headers?: RawAxiosRequestHeaders;
  data?: OutgoingWebhookPayloads[keyof OutgoingWebhookPayloads];
  timeout?: number;
  secret?: string;
};

const outgoingWebhookConfigurationMap: Record<
  keyof OutgoingWebhookPayloads,
  { url: string; method: string; headers: RawAxiosRequestHeaders; timeout: number }
> = {
  'workflow.completed': {
    url: 'https://example.com',
    method: 'POST',
    headers: {},
    timeout: 15000,
  },
  'workflow.state.changed': {
    url: 'https://example.com',
    method: 'POST',
    headers: {},
    timeout: 15000,
  },
  'workflow.context.document.changed': {
    url: 'https://example.com',
    method: 'POST',
    headers: {},
    timeout: 15000,
  },
  'user-created-outgoing': {
    url: 'https://example.com',
    method: 'POST',
    headers: {},
    timeout: 15000,
  },
  'website-validation-finished': {
    url: 'https://example.com',
    method: 'POST',
    headers: {},
    timeout: 15000,
  },
};

type IncomingWebhookPayloads = {
  'user-verification-completed': {
    userId: string;
    data: Record<string, any>;
    metadata: Record<string, any>;
  };
  'other-incoming-event': {
    someData: string;
  };
};

export const alertWebhookFailure = (error: unknown) => {
  const errorToAlert = new Error(`Failed to send a webhook`, { cause: error });
  const context = isAxiosError(error) ? { ...error } : {};

  Sentry.captureException(errorToAlert, {
    extra: context,
  });
};

@Injectable()
export class WebhooksService {
  private readonly queues = new Map<string, RetryableQueue>();

  constructor(
    private readonly logger: AppLoggerService,
    private readonly httpService: HttpService,
  ) {
    this.initializeQueues();
  }

  private initializeQueues() {
    const connection: ConnectionOptions = {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      // Required workaround
      tls: {},
    };

    if (!env.QUEUE_SYSTEM_ENABLED) {
      return;
    }

    const redis = new IORedis({ ...connection, retryStrategy: () => null, connectTimeout: 5_000 });

    redis.on('connect', () => {
      redis.disconnect();

      const outgoingWebhooks = new RetryableQueue<OutgoingWebhookJobData>('outgoing-webhooks', {
        connection,
        maxRetries: 3,
        handlers: {
          handleJob: async job => {
            this.logger.log(`Processing outgoing webhook job ${job.id}`);

            return this.httpService.axiosRef.request(job.data);
          },
          handleDLQJob: async (job, err) => {
            this.logger.log(`Processing outgoing webhook dead letter queue ${job.id}`);
            console.log(err);
            console.log(job.data);
            // alertWebhookFailure(err);
          },
        },
      });

      const incomingWebhooks = new RetryableQueue<IncomingWebhookPayloads>('incoming-webhooks', {
        connection,
        maxRetries: 3,
        handlers: {
          handleJob: async job => {
            this.logger.log(`Processing incoming webhook job ${job.id}`);
            console.log(job.data);
          },
          handleDLQJob: async (job, err) => {
            this.logger.log(`Processing incoming webhook dead letter queue ${job.id}`);
            console.log(err);
            console.log(job.data);
            // alertWebhookFailure(err);
          },
        },
      });

      this.queues.set('outgoing', outgoingWebhooks);
      this.queues.set('incoming', incomingWebhooks);
    });

    redis.on('error', error => {
      this.logger.error(`Failed to connect to Redis, continuing without queue support: ${error}`);
    });
  }

  async invokeWebhook<T extends keyof OutgoingWebhookPayloads>(
    name: T,
    options: {
      data: OutgoingWebhookPayloads[T];
      secret?: string;
    },
  ) {
    const { url, method, headers: defaultHeaders, timeout } = outgoingWebhookConfigurationMap[name];
    const { data, secret } = options;

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

    const requestData: OutgoingWebhookJobData = { url, method, headers, data, timeout };

    const queue = this.queues.get('outgoing');

    if (queue) {
      return await queue.queue.add(name, requestData);
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
    await Promise.all(Array.from(this.queues.values()).map(queue => queue.shutdown()));
  }

  async onModuleInit() {
    await Promise.all(
      Array.from(this.queues.values()).map(queue => queue.queue.resume().then(queue.dlq.resume)),
    );
  }
}
