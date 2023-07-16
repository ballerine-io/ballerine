import { randomUUID } from 'crypto';
import { env } from '@/env';
import { getDynamicWebhookUrl } from '@/events/get-dynamic-webhook-url';
import { WorkflowDefinition } from '@prisma/client';

export const getWebhookInfo = (config: WorkflowDefinition['config']) => {
  const id = randomUUID();
  const environment = env.NODE_ENV;
  const url = getDynamicWebhookUrl(config, 'workflow.context.document.changed') || env.WEBHOOK_URL;
  const authSecret = env.WEBHOOK_SECRET;

  return { id, environment, url, authSecret };
};
