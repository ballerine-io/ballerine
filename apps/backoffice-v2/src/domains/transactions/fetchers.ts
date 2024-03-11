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
  INBOUND: 'inbound',
  OUTBOUND: 'outbound',
} as const;

export const TransactionDirections = [
  TransactionDirection.INBOUND,
  TransactionDirection.OUTBOUND,
] as const satisfies ReadonlyArray<TObjectValues<typeof TransactionDirection>>;

export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'pay_pal',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
  APN: 'apn',
} as const;

export const PaymentMethods = [
  PaymentMethod.CREDIT_CARD,
  PaymentMethod.DEBIT_CARD,
  PaymentMethod.BANK_TRANSFER,
  PaymentMethod.PAYPAL,
  PaymentMethod.APPLE_PAY,
  PaymentMethod.GOOGLE_PAY,
  PaymentMethod.APN,
] as const satisfies ReadonlyArray<TObjectValues<typeof PaymentMethod>>;

export const TransactionsListSchema = z.array(
  ObjectWithIdSchema.extend({
    transactionDate: z.string().datetime(),
    transactionDirection: z.enum(TransactionDirections),
    transactionBaseAmount: z.number(),
    transactionBaseCurrency: z.string(),

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
    counterpartyOriginatorId: z.string().nullable(),
    paymentMethod: z.enum(PaymentMethods),
  }).transform(({ counterpartyOriginator, ...data }) => ({
    ...data,
    counterpartyOriginatorName:
      noNullish`${counterpartyOriginator?.endUser?.firstName} ${counterpartyOriginator?.endUser?.lastName}`.trim(),
    transactionBaseAmountWithCurrency:
      noNullish`${data.transactionBaseAmount} ${data.transactionBaseCurrency}`.trim(),
  })),
);

export type TTransactionsList = z.output<typeof TransactionsListSchema>;

export const fetchTransactions = async (params: {
  counterpartyId: string;
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
