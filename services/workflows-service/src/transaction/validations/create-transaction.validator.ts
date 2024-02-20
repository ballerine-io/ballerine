import z from 'zod';
import { PaymentMethod } from '@prisma/client';

export const createTranscationValidator = z.object({
  amount: z.number().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
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
