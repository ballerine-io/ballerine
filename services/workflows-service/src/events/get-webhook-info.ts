import { randomUUID } from 'crypto';
import { getDynamicWebhookUrl } from '@/events/get-dynamic-webhook-url';
import { WorkflowDefinition } from '@prisma/client';
import packageJson from '../../package.json';

export const getWebhookInfo = (
  config: WorkflowDefinition['config'],
  NODE_ENV: string | undefined,
  WEBHOOK_URL: string | undefined,
  WEBHOOK_SECRET: string | undefined,
) => {
  const id = randomUUID();
  const environment = NODE_ENV;
  const url = getDynamicWebhookUrl(config, 'workflow.context.document.changed') || WEBHOOK_URL;
  const authSecret = WEBHOOK_SECRET;

  return { id, environment, url, authSecret, apiVersion: packageJson.version };
};
