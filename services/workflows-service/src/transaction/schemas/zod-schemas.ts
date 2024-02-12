import { z } from 'zod';

export const PaymentMethodSchema = z.enum([
  'CreditCard',
  'DebitCard',
  'BankTransfer',
  'Cash',
  'Check',
  'APN',
]);
