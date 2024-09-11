import { SubscriptionSchema } from '@/common/types';
import { z } from 'zod';

export const CustomerSubscriptionSchema = z.object({ subscriptions: z.array(SubscriptionSchema) });

export type TCustomerSubscription = z.infer<typeof CustomerSubscriptionSchema>;

const CustomerConfigSchema = z.object({
  ongoingWorkflowDefinitionId: z.string(),
  isDemo: z.boolean().default(false),
  hideCreateMerchantMonitoringButton: z.boolean().default(true),
});

export type TCustomerConfig = z.infer<typeof CustomerConfigSchema>;
