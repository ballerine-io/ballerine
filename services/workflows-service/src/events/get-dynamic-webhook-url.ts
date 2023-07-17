import { WorkflowConfig } from '@/workflow/schemas/zod-schemas';
import { TEventName } from '@/workflow/types';

export const getDynamicWebhookUrl = (config: WorkflowConfig, event: TEventName) => {
  if (!config || !config.subscriptions) return;

  const subscription = config.subscriptions.find(sub => sub.events.includes(event));

  if (!subscription || subscription.type !== 'webhook') return;

  return subscription.url;
};
