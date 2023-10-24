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
    isLegacyReject: z.boolean().optional(),
    subscriptions: z.array(SubscriptionSchema).optional(),
    completedWhenTasksResolved: z.boolean().optional(),
    workflowLevelResolution: z.boolean().optional(),
    allowMultipleActiveWorkflows: z.boolean().optional(),
    initialEvent: z.string().optional(),
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
  })
  .strict()
  .optional();

export type WorkflowConfig = z.infer<typeof ConfigSchema>;
