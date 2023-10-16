import { randomUUID } from 'crypto';
import packageJson from '../../package.json';
import { WorkflowConfig } from '@/workflow/schemas/zod-schemas';

export type Webhook = {
  id: string;
  url: string;
  environment: string | undefined;
  apiVersion: string;
};

export const getWebhooks = (
  config: WorkflowConfig,
  NODE_ENV: string | undefined,
  event: string,
): Webhook[] => {
  return (config?.subscriptions ?? [])
    .filter(({ type, events }) => type === 'webhook' && events.includes(event))
    .map(
      ({ url }): Webhook => ({
        id: randomUUID(),
        url,
        environment: NODE_ENV,
        apiVersion: packageJson.version,
      }),
    );
};
