import { SubscriptionSchema } from '@/common/types';
import dayjs from 'dayjs';
import { z } from 'zod';

export const CustomerSubscriptionSchema = z.object({ subscriptions: z.array(SubscriptionSchema) });

export type TCustomerSubscription = z.infer<typeof CustomerSubscriptionSchema>;

export const CustomerConfigSchema = z.object({
  isDemoKybEnabled: z.boolean().optional(),
  isDemoKybUsEnabled: z.boolean().optional(),
  isDemo: z.boolean().optional(),
  expiresAt: z.number().optional(),
  showFullAccessPopup: z.boolean().optional(),
  ongoingWorkflowDefinitionId: z.string().optional(),
  hideCreateMerchantMonitoringButton: z.boolean().default(true).optional(),
  isMerchantMonitoringEnabled: z.boolean().default(false).optional(),
  isOngoingMonitoringEnabled: z.boolean().default(false).optional(),
  isCasesOnboardingEnabled: z.boolean().default(false).optional(),
  maxBusinessReports: z.number().default(10).optional().nullable(),
  withQualityControl: z.boolean().default(true).optional(),
  disableBusinessSyncToUnifiedApi: z.boolean().default(false).nullish(),
  isDemoAccount: z.boolean().default(false).optional(),
  isKybAndOwnershipAssessmentEnabled: z.boolean().default(false).optional(),
  isCompanySanctionsAssessmentEnabled: z.boolean().default(false).optional(),
  createIdentityVerification: z.boolean().default(false).optional(),
});

export type TCustomerConfig = z.infer<typeof CustomerConfigSchema>;

export const CustomerFeaturesSchema = z.object({
  // OCR Features
  isDocumentOcrEnabled: z.boolean().optional(),

  // Dashboard Features
  mockDashboardV1: z.boolean().optional(),

  // Report Features
  enableWebPresenceReportExport: z.boolean().optional(),
  createBusinessReport: z
    .object({
      enabled: z.boolean(),
      options: z
        .object({
          type: z.string(),
          version: z.string(),
        })
        .optional(),
    })
    .optional(),
  createBusinessReportBatch: z
    .object({
      enabled: z.boolean(),
      options: z
        .object({
          type: z.string(),
          version: z.string(),
        })
        .optional(),
    })
    .optional(),

  // Monitoring Features
  ONGOING_MERCHANT_REPORT: z
    .object({
      name: z.string(),
      enabled: z.boolean(),
      options: z
        .object({
          reportType: z.string().optional(),
          runByDefault: z.boolean().optional(),
          scheduleType: z.string().optional(),
          dayInMonth: z.number().optional(),
          monthInterval: z.number().optional(),
          proxyViaCountry: z.string().optional(),
          workflowVersion: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type TCustomerFeatures = z.infer<typeof CustomerFeaturesSchema>;

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
