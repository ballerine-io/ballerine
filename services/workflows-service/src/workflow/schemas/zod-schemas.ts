import { SubscriptionSchema } from '@/common/types';
import { WorkflowDefinitionConfigThemeSchema } from '@ballerine/common';
import { z } from 'zod';

export const ConfigSchema = z
  .object({
    isInitiateSanctionsScreeningEnabled: z.boolean().optional(),
    isDocumentsV2: z.boolean().optional(),
    isAssociatedCompanyKybEnabled: z.boolean().optional(),
    isCaseOverviewEnabled: z.boolean().optional(),
    isDocumentTrackerEnabled: z.boolean().optional(),
    isCaseRiskOverviewEnabled: z.boolean().optional(),
    isLegacyReject: z.boolean().optional(),
    isLockedDocumentCategoryAndType: z.boolean().optional(),
    isManualCreation: z.boolean().optional(),
    isExample: z.boolean().optional(), // OSS only
    language: z.string().optional(),
    supportedLanguages: z.array(z.string()).optional(),
    subscriptions: z.array(SubscriptionSchema).optional(),
    completedWhenTasksResolved: z.boolean().optional(),
    workflowLevelResolution: z.boolean().optional(),
    isCollectionFlowPageRevisionEnabled: z.boolean().optional(),
    isAgentEditingEnabled: z.boolean().optional(),
    allowMultipleActiveWorkflows: z.boolean().optional(),
    initialEvent: z.string().optional(),
    availableDocuments: z.array(z.object({ category: z.string(), type: z.string() })).optional(),
    callbackResult: z
      .object({
        transformers: z.array(z.any()),
        action: z.string().optional(),
        deliverEvent: z.string().optional(),
        persistenceStates: z.array(z.string()).optional(),
      })
      .optional(),
    childCallbackResults: z
      .array(
        z
          .object({
            definitionId: z.string(),
            transformers: z.array(z.any()),
            action: z.string().optional(),
            deliverEvent: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
    createCollectionFlowToken: z
      .boolean()
      .optional()
      .describe('Whether to create a collection flow token as part of the workflow'),
    mainRepresentative: z
      .object({
        fullName: z.string(),
        email: z.string().email(),
      })
      .optional()
      .describe('Main representative of the company'),
    customerName: z.string().optional().describe('The customer (tenant) display name'),
    enableManualCreation: z
      .boolean()
      .optional()
      .describe('Indicates if workflow could be created in backoffice'),
    kybOnExitAction: z.enum(['send-event', 'redirect-to-customer-portal']).optional(),
    reportConfig: z.record(z.string(), z.unknown()).optional(),
    theme: WorkflowDefinitionConfigThemeSchema.optional(),
    hasUboOngoingMonitoring: z.boolean().optional(),
    maxBusinessReports: z.number().nonnegative().optional(),
    isMerchantMonitoringEnabled: z.boolean().optional(),
    isOngoingMonitoringEnabled: z.boolean().optional(),
    isCasesOnboardingEnabled: z.boolean().optional(),
    isDemoAccount: z.boolean().optional(),
    withQualityControl: z.boolean().optional(),
    disableBusinessSyncToUnifiedApi: z.boolean().optional(),
    uiOptions: z
      .object({
        redirectUrls: z
          .object({
            success: z.string().url().optional(),
            failure: z.string().url().optional(),
          })
          .optional(),
      })
      .optional(),
    editableContext: z
      .object({
        entityInfo: z.boolean().optional(),
        kyc: z
          .object({
            entity: z.boolean().optional(),
          })
          .optional(),
      })
      .optional(),
    ubos: z
      .object({
        create: z
          .object({
            enabled: z.boolean().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .strict()
  .optional();

export type WorkflowConfig = z.infer<typeof ConfigSchema>;

export const CustomerConfigSchema = z.object({
  ongoingWorkflowDefinitionId: z.string().optional(),
  hideCreateMerchantMonitoringButton: z.boolean().optional(),
  isExample: z.boolean().optional(),
  isMerchantMonitoringEnabled: z.boolean().optional(),
  isOngoingMonitoringEnabled: z.boolean().optional(),
  isCasesOnboardingEnabled: z.boolean().optional(),
  isDemo: z.boolean().optional(),
  maxBusinessReports: z.number().optional(),
});

export type TCustomerConfig = z.infer<typeof CustomerConfigSchema>;
