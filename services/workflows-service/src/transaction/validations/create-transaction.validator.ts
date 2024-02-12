import z from 'zod';
import { PaymentMethodSchema } from '../schemas/zod-schemas';

export const createTranscationValidator = z.object({
  amount: z.number().optional(),
  paymentMethod: PaymentMethodSchema.optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  transactionId: z.string().optional(),
  transactionType: z.enum(['Deposit', 'Withdrawal']),
  userId: z.string().optional(),
  user: z.object({
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});
