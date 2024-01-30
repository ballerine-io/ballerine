import { SubscriptionSchema } from '@/common/types';
import { z } from 'zod';

export const CustomerSubscriptionSchema = z.array(SubscriptionSchema);

export type TCustomerSubscription = z.infer<typeof CustomerSubscriptionSchema>;
