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
  envName: string | undefined,
  event: string,
): Webhook[] => {
  return (config?.subscriptions ?? [])
    .filter(({ type, events }) => type === 'webhook' && events.includes(event))
    .map(
      ({ url }): Webhook => ({
        id: randomUUID(),
        url,
        environment: envName,
        apiVersion: packageJson.version,
      }),
    );
};

export const getCustomerWebhooks = (
  subscriptions: any, // TODO: replace with SubscriptionSchema
  envName: string | undefined,
  event: string,
): Webhook[] => {
  return (subscriptions ?? [])
    .filter(
      ({ type, events }: { type: string; events: string }) =>
        type === 'webhook' && events.includes(event),
    )
    .map(
      ({ url }: { url: string }): Webhook => ({
        id: randomUUID(),
        url,
        environment: envName,
        apiVersion: packageJson.version,
      }),
    );
};
