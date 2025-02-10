import { randomUUID } from 'crypto';
import packageJson from '../../package.json';
import { WorkflowConfig } from '@/workflow/schemas/zod-schemas';
import { TCustomerSubscription } from '@/customer/schemas/zod-schemas';

export type Webhook = {
  id: string;
  url: string;
  environment: string | undefined;
  apiVersion: string;
  config?: {
    withChildWorkflows?: boolean;
  };
};

export const mergeSubscriptions = (
  customerSubscriptions: TCustomerSubscription['subscriptions'],
  workflowSubscriptions: TCustomerSubscription['subscriptions'],
): TCustomerSubscription['subscriptions'] => {
  if (!workflowSubscriptions?.length) {
    return customerSubscriptions ?? [];
  }

  if (!customerSubscriptions?.length) {
    return workflowSubscriptions ?? [];
  }

  const workflowEvents = workflowSubscriptions.flatMap(sub => sub.events);

  const processedCustomerSubs = customerSubscriptions.reduce<typeof customerSubscriptions>(
    (acc, sub) => {
      if (sub.events.length === 0) {
        acc.push(sub);

        return acc;
      }

      const remainingEvents = sub.events.filter(event => !workflowEvents.includes(event));

      if (remainingEvents.length > 0) {
        acc.push({
          ...sub,
          events: remainingEvents,
        });
      }

      return acc;
    },
    [],
  );

  return [...processedCustomerSubs, ...workflowSubscriptions];
};

export const getWebhooks = ({
  workflowConfig,
  customerSubscriptions,
  envName,
  event,
}: {
  workflowConfig: WorkflowConfig;
  customerSubscriptions: TCustomerSubscription['subscriptions'];
  envName: string | undefined;
  event: string;
}): Webhook[] => {
  const mergedSubscriptions = mergeSubscriptions(
    customerSubscriptions,
    workflowConfig?.subscriptions ?? [],
  );

  return mergedSubscriptions
    .filter(({ type, events }) => type === 'webhook' && events.includes(event))
    .map(
      ({ url, config }): Webhook => ({
        id: randomUUID(),
        url,
        environment: envName,
        apiVersion: packageJson.version,
        config,
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
