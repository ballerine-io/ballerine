import { BaseJobOptions } from 'bullmq/dist/esm/interfaces';

export const QUEUES = {
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
} satisfies Record<string, { name: string; config: BaseJobOptions }>;
