import { z } from 'zod';

export const SubscriptionSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('webhook'),
      url: z.string().url(),
      events: z.array(z.string().nonempty()),
    })
    .strict(),
]);

export const ConfigSchema = z
  .object({
    language: z.string().optional(),
    supportedLanguages: z.array(z.string()).optional(),
    isLegacyReject: z.boolean().optional(),
    subscriptions: z.array(SubscriptionSchema).optional(),
    completedWhenTasksResolved: z.boolean().optional(),
    workflowLevelResolution: z.boolean().optional(),
    isLockedDocumentCategoryAndType: z.boolean().optional(),
    allowMultipleActiveWorkflows: z.boolean().optional(),
    initialEvent: z.string().optional(),
    availableDocuments: z.array(z.object({ category: z.string(), type: z.string() })).optional(),
    isDemo: z.boolean().optional(),
    isExample: z.boolean().optional(), // OSS only
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
  })
  .strict()
  .optional();

export type WorkflowConfig = z.infer<typeof ConfigSchema>;
