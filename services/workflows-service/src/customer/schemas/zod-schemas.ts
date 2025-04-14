import { SubscriptionSchema } from '@/common/types';
import dayjs from 'dayjs';
import { z } from 'zod';

export const CustomerSubscriptionSchema = z.object({ subscriptions: z.array(SubscriptionSchema) });

export type TCustomerSubscription = z.infer<typeof CustomerSubscriptionSchema>;

const CustomerConfigSchema = z.object({
  ongoingWorkflowDefinitionId: z.string().optional(),
  hideCreateMerchantMonitoringButton: z.boolean().default(true).optional(),
  isMerchantMonitoringEnabled: z.boolean().default(false).optional(),
  isOngoingMonitoringEnabled: z.boolean().default(false).optional(),
  isCasesOnboardingEnabled: z.boolean().default(false).optional(),
  maxBusinessReports: z.number().default(10).optional(),
  withQualityControl: z.boolean().default(true).optional(),
  disableBusinessSyncToUnifiedApi: z.boolean().default(false).nullish(),
  isDemoAccount: z.boolean().default(false).optional(),
});

export type TCustomerConfig = z.infer<typeof CustomerConfigSchema>;

export const AccessDetailsSchema = z
  .object({
    totalReports: z.number(),
    expiresAt: z.number(),
    seenWelcomeModal: z.boolean().optional(),
    maxBusinessReports: z.number().optional(),
  })
  .transform(data => {
    const {
      totalReports,
      expiresAt: expiresAtUnix,
      maxBusinessReports = 10,
      seenWelcomeModal = true,
    } = data;
    const reportsLeft = maxBusinessReports - totalReports;
    const now = dayjs();
    const expiresAt = dayjs(expiresAtUnix * 1000);
    const demoDaysLeft = now.isAfter(expiresAt) ? 0 : expiresAt.diff(now, 'days') + 1;

    return {
      totalReports,
      expiresAt: expiresAtUnix,
      maxBusinessReports,
      seenWelcomeModal,
      reportsLeft,
      demoDaysLeft,
    };
  });

export type TAccessDetailsInput = z.input<typeof AccessDetailsSchema>;
export type TAccessDetails = z.output<typeof AccessDetailsSchema>;
