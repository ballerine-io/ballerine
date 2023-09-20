import { SubscriptionSchema, WorkflowConfig } from '@/workflow/schemas/zod-schemas';
import { TEventName } from '@/workflow/types';
import { z } from 'zod';

export const getDynamicWebhookConfigurations = (config: WorkflowConfig, event: TEventName) => {
  if (!config || !config.subscriptions) return;

  const subscription = config.subscriptions.find(sub => sub.events.includes(event));

  if (!subscription || subscription.type !== 'webhook') return;

  const authorizationHeader = subscription.authorizationType;
  return {
    url: subscription.url,
    authorizationKey: subscription.authorizationKey,
    secretType: subscription.secretType,
  };
};

const composeAuthorizationHeaders = (
  subscription: z.infer<typeof SubscriptionSchema>['authorizationType'],
) => {};
