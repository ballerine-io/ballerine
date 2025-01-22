import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { isAxiosError, RawAxiosRequestHeaders } from 'axios';
import type { ConnectionOptions } from 'bullmq';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';
import { sign } from '@ballerine/common';
import { HttpService } from '@nestjs/axios';
import { RetryableQueue } from './retryable-queue';

const REDIS_CONFIG: ConnectionOptions = {
  host: env.REDIS_HOST || 'localhost',
  port: env.REDIS_PORT || 7381,
  ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
  ...(env.REDIS_DB ? { db: env.REDIS_DB } : {}),
};

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
export class WebhookService {
  private readonly queues = new Map<string, RetryableQueue>();

  constructor(private readonly logger: AppLoggerService, private httpService: HttpService) {
    this.initializeQueues();
  }

  private initializeQueues() {
    const outgoingWebhooks = new RetryableQueue<OutgoingWebhookJobData>('outgoing-webhooks', {
      connection: REDIS_CONFIG,
      maxRetries: 3,
      handlers: {
        handleJob: async job => {
          this.logger.log(`Processing outgoing webhook job ${job.id}`);

          const { url, method, headers, data, timeout } = job.data;

          return this.httpService.axiosRef.request({
            url,
            method,
            headers,
            data,
            timeout,
          });
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
      connection: REDIS_CONFIG,
      maxRetries: 3,
      handlers: {
        handleJob: async job => {
          this.logger.log(`Processing incoming webhook job ${job.id}`);
          console.log(job.data);
        },
        handleDLQJob: async (job, err) => {
          this.logger.log(`Processing incoming webhook dead letter queue ${job.id}`);
          console.log(job.data);
          // alertWebhookFailure(err);
        },
      },
    });

    this.queues.set('outgoing', outgoingWebhooks);
    this.queues.set('incoming', incomingWebhooks);
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
    // const res = await this.#__axios.post(url, payload, {
    //   headers: {
    //     'X-Authorization': webhookSharedSecret,
    //     'X-HMAC-Signature': sign({ payload, key: webhookSharedSecret }),
    //   },
    // });

    if (data && secret) {
      headers['X-Authorization'] = secret;
      headers['X-HMAC-Signature'] = sign({
        payload: data,
        key: secret,
      });
    }

    const queue = this.queues.get('outgoing');

    if (!queue) {
      throw new Error('Outgoing queue not initialized');
    }

    return await queue.queue.add(name, {
      url,
      method,
      headers,
      data,
      timeout: timeout || 15000,
    });
  }

  // async handleIncoming<T extends keyof IncomingWebhookPayloads>(
  //   name: T,
  //   options: {
  //     data: IncomingWebhookPayloads[T];
  //   },
  // ) {
  //   const {} = config;

  //   const queue = this.queues.get('incoming');

  //   if (!queue) {
  //     throw new Error('Incoming queue not initialized');
  //   }

  //   return await queue.queue.add(name, {
  //     url,
  //     method,
  //     headers,
  //     data: body,
  //     timeout: timeout || 15000,
  //   } satisfies IncomingWebhookInvocationConfig<T>);
  // }

  async onModuleDestroy() {
    await Promise.all(Array.from(this.queues.values()).map(queue => queue.shutdown()));
  }

  async onModuleInit() {
    await Promise.all(
      Array.from(this.queues.values()).map(queue => queue.queue.resume().then(queue.dlq.resume)),
    );
  }
}
