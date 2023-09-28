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
    subscriptions: z.array(SubscriptionSchema),
    completedWhenTasksResolved: z.boolean().optional(),
    workflowLevelResolution: z.boolean().optional(),
    allowMultipleActiveWorkflows: z.boolean().optional(),
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
  })
  .strict()
  .optional();

export type WorkflowConfig = z.infer<typeof ConfigSchema>;
