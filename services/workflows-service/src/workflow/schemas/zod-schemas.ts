import { SubscriptionSchema } from '@/common/types';
import { z } from 'zod';

export const ConfigSchema = z
  .object({
    isAssociatedCompanyKybEnabled: z.boolean().optional(),
    isCaseOverviewEnabled: z.boolean().optional(),
    isLegacyReject: z.boolean().optional(),
    isLockedDocumentCategoryAndType: z.boolean().optional(),
    isManualCreation: z.boolean().optional(),
    isDemo: z.boolean().optional(),
    isExample: z.boolean().optional(), // OSS only
    language: z.string().optional(),
    supportedLanguages: z.array(z.string()).optional(),
    subscriptions: z.array(SubscriptionSchema).optional(),
    completedWhenTasksResolved: z.boolean().optional(),
    workflowLevelResolution: z.boolean().optional(),
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
  })
  .strict()
  .optional();

export type WorkflowConfig = z.infer<typeof ConfigSchema>;
