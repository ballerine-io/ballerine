import { randomUUID } from 'crypto';
import { getDynamicWebhookConfigurations } from '@/events/get-dynamic-webhook-configurations';
import { WorkflowDefinition } from '@prisma/client';
import packageJson from '../../package.json';

export const getWebhookInfo = (
  config: WorkflowDefinition['config'],
  NODE_ENV: string | undefined,
  Customer: string | undefined,
  WEBHOOK_SECRET: string | undefined,
  event: string,
) => {
  const id = randomUUID();
  const environment = NODE_ENV;
  const { url, authSecret, secretType } = getDynamicWebhookConfigurations(config, event);
  const authSecret = WEBHOOK_SECRET;

  return { id, environment, url, authSecret, apiVersion: packageJson.version };
};
