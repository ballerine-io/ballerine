import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { z } from 'zod';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { env } from '@/common/env/env';
import { TObjectValues } from '@/common/types';
import { noNullish } from '@ballerine/common';
import qs from 'qs';

export const TransactionDirection = {
  INBOUND: 'Inbound',
  OUTBOUND: 'Outbound',
} as const;

export const TransactionDirections = [
  TransactionDirection.INBOUND,
  TransactionDirection.OUTBOUND,
] as const satisfies ReadonlyArray<TObjectValues<typeof TransactionDirection>>;

export const PaymentMethod = {
  CREDIT_CARD: 'CreditCard',
  DEBIT_CARD: 'DebitCard',
  BANK_TRANSFER: 'BankTransfer',
  PAYPAL: 'PayPal',
  APPLE_PAY: 'ApplePay',
  GOOGLE_PAY: 'GooglePay',
} as const;

export const PaymentMethods = [
  PaymentMethod.CREDIT_CARD,
  PaymentMethod.DEBIT_CARD,
  PaymentMethod.BANK_TRANSFER,
  PaymentMethod.PAYPAL,
  PaymentMethod.APPLE_PAY,
  PaymentMethod.GOOGLE_PAY,
] as const satisfies ReadonlyArray<TObjectValues<typeof PaymentMethod>>;

export const TransactionsListSchema = z.array(
  ObjectWithIdSchema.extend({
    transactionDate: z.string().datetime(),
    transactionDirection: z.enum(TransactionDirections),
    transactionBaseAmount: z.number(),
    transactionBaseCurrency: z.string(),
    businessId: z.string().nullable(),
    business: z
      .object({
        companyName: z.string(),
      })
      .nullable(),
    counterpartyOriginator: z
      .object({
        endUser: z
          .object({
            firstName: z.string(),
            lastName: z.string(),
          })
          .nullable(),
      })
      .nullable(),
    counterpartyOriginatorId: z.string(),
    paymentMethod: z.enum(PaymentMethods),
  }).transform(({ business, counterpartyOriginator, ...data }) => ({
    ...data,
    business: business?.companyName,
    counterpartyOriginatorName:
      noNullish`${counterpartyOriginator?.endUser?.firstName} ${counterpartyOriginator?.endUser?.lastName}`.trim(),
    transactionBaseAmountWithCurrency: `${data.transactionBaseAmount} ${data.transactionBaseCurrency}`,
  })),
);

export type TTransactionsList = z.output<typeof TransactionsListSchema>;

export const fetchTransactions = async (params: {
  businessId: string;
  page: {
    number: number;
    size: number;
  };
}) => {
  const queryParams = qs.stringify(params, { encode: false });
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/transactions?${queryParams}`,
    method: Method.GET,
    schema: TransactionsListSchema,
  });

  return handleZodError(error, alerts);
};
