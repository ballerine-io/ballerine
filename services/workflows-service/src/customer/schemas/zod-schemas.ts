import { SubscriptionSchema } from '@/common/types';
import { z } from 'zod';

export const CustomerSubscriptionSchema = z.array(SubscriptionSchema);

export const CustomerConfigSchema = z
  .object({
    subscriptions: z.array(SubscriptionSchema),
  })
  .strict();

export type CustomerConfig = z.infer<typeof CustomerConfigSchema>;
