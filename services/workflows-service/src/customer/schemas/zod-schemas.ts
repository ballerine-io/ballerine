import { SubscriptionSchema } from '@/common/types';
import { z } from 'zod';

export const CustomerSubscriptionSchema = z.object({ subscriptions: z.array(SubscriptionSchema) });

export type TCustomerSubscription = z.infer<typeof CustomerSubscriptionSchema>;

const CustomerConfigSchema = z.object({
  ongoingWorkflowDefinitionId: z.string().optional(),
  isDemo: z.boolean().default(false).optional(),
  hideCreateMerchantMonitoringButton: z.boolean().default(true).optional(),
  isMerchantMonitoringEnabled: z.boolean().default(false).optional(),
  maxBusinessReports: z.number().default(10).optional(),
});

export type TCustomerConfig = z.infer<typeof CustomerConfigSchema>;
