import { SubscriptionSchema } from '@/common/types';
import dayjs from 'dayjs';
import { z } from 'zod';

export const CustomerSubscriptionSchema = z.object({ subscriptions: z.array(SubscriptionSchema) });

export type TCustomerSubscription = z.infer<typeof CustomerSubscriptionSchema>;

const CustomerConfigSchema = z.object({
  ongoingWorkflowDefinitionId: z.string().optional(),
  isDemo: z.boolean().default(false).optional(),
  hideCreateMerchantMonitoringButton: z.boolean().default(true).optional(),
  isMerchantMonitoringEnabled: z.boolean().default(false).optional(),
  maxBusinessReports: z.number().default(10).optional(),
  withQualityControl: z.boolean().default(true).optional(),
  disableBusinessSyncToUnifiedApi: z.boolean().default(false).nullish(),
  isDemoAccount: z.boolean().default(false).optional(),
});

export type TCustomerConfig = z.infer<typeof CustomerConfigSchema>;

export const DemoAccessDetailsSchema = z
  .object({
    totalReports: z.number(),
    expiresAt: z.number(),
    seenWelcomeModal: z.boolean().optional(),
    maxBusinessReports: z.number().optional(),
  })
  .transform(data => {
    const { totalReports, expiresAt, maxBusinessReports = 10, seenWelcomeModal = true } = data;
    const reportsLeft = maxBusinessReports - totalReports;
    const demoDaysLeft = dayjs(expiresAt * 1000).diff(dayjs(), 'days');

    return {
      totalReports,
      expiresAt,
      maxBusinessReports,
      seenWelcomeModal,
      reportsLeft,
      demoDaysLeft,
    };
  });

export type TDemoAccessDetailsInput = z.input<typeof DemoAccessDetailsSchema>;
export type TDemoAccessDetails = z.output<typeof DemoAccessDetailsSchema>;
