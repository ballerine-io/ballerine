import z from 'zod';
import { PaymentMethodSchema } from './schemas/zod-schemas';

export type TAuthenticationConfiguration = {
  apiType: 'API_KEY' | 'OAUTH2' | 'BASIC_AUTH';
  authValue: string;
  validUntil?: string;
  isValid: boolean;
  webhookSharedSecret: string;
};

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
