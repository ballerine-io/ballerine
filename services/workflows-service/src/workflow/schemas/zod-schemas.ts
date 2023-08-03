import { z } from 'zod';

const SubscriptionSchema = z
  .object({
    type: z.enum(['webhook', 'slack']),
    url: z.string().url().optional(),
    events: z.array(z.string()),
  })
  .strict();

export const ConfigSchema = z
  .object({
    subscriptions: z.array(SubscriptionSchema).optional(),
    completedWhenTasksResolved: z.boolean().optional(),
    workflowLevelResolution: z.boolean().optional(),
    allowMultipleActiveWorkflows: z.boolean().optional(),
  })
  .strict()
  .optional();

export type WorkflowConfig = z.infer<typeof ConfigSchema>;
