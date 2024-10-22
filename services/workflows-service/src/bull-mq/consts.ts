import { BaseJobOptions } from 'bullmq/dist/esm/interfaces';

export const QUEUES = {
  DEFAULT: {
    name: 'default',
    dlq: 'default-dlq',
    config: {
      attempts: 15,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  },
  INCOMING_WEBHOOKS_QUEUE: {
    name: 'incoming-webhook-queue',
    config: {
      attempts: 10,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  },
  OUTGOING_WEBHOOKS_QUEUE: {
    name: 'outgoing-webhook-queue',
    config: {
      attempts: 10,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  },
} satisfies Record<string, { name: string; dlq?: string; config: BaseJobOptions }>;
