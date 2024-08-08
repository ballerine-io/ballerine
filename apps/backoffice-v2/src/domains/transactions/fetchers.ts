import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { z } from 'zod';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { env } from '@/common/env/env';
import qs from 'qs';
import { ObjectValues } from '@ballerine/common';

export const TransactionDirection = {
  INBOUND: 'inbound',
  OUTBOUND: 'outbound',
} as const;

export const TransactionDirections = [
  TransactionDirection.INBOUND,
  TransactionDirection.OUTBOUND,
] as const satisfies ReadonlyArray<ObjectValues<typeof TransactionDirection>>;

export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'pay_pal',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
  APM: 'apm',
} as const;

export const PaymentMethods = [
  PaymentMethod.CREDIT_CARD,
  PaymentMethod.DEBIT_CARD,
  PaymentMethod.BANK_TRANSFER,
  PaymentMethod.PAYPAL,
  PaymentMethod.APPLE_PAY,
  PaymentMethod.GOOGLE_PAY,
  PaymentMethod.APM,
] as const satisfies ReadonlyArray<ObjectValues<typeof PaymentMethod>>;

const TransactionStatus = {
  NEW: 'new',
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const;

const TransactionStatuses = [
  TransactionStatus.NEW,
  TransactionStatus.PENDING,
  TransactionStatus.ACTIVE,
  TransactionStatus.COMPLETED,
  TransactionStatus.REJECTED,
  TransactionStatus.CANCELLED,
  TransactionStatus.FAILED,
] as const satisfies ReadonlyArray<ObjectValues<typeof TransactionStatus>>;

const TransactionType = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
  PAYMENT: 'payment',
  REFUND: 'refund',
  CHARGEBACK: 'chargeback',
} as const;

const TransactionTypes = [
  TransactionType.DEPOSIT,
  TransactionType.WITHDRAWAL,
  TransactionType.TRANSFER,
  TransactionType.PAYMENT,
  TransactionType.REFUND,
  TransactionType.CHARGEBACK,
] as const satisfies ReadonlyArray<ObjectValues<typeof TransactionType>>;

const PaymentType = {
  INSTANT: 'instant',
  SCHEDULED: 'scheduled',
  RECURRING: 'recurring',
  REFUND: 'refund',
};

const PaymentTypes = [
  PaymentType.INSTANT,
  PaymentType.SCHEDULED,
  PaymentType.RECURRING,
  PaymentType.REFUND,
] as const satisfies ReadonlyArray<ObjectValues<typeof PaymentType>>;

const PaymentChannel = {
  online: 'online',
  mobile_app: 'mobile_app',
  in_store: 'in_store',
  telephone: 'telephone',
  mail_order: 'mail_order',
};

const PaymentChannels = [
  PaymentChannel.online,
  PaymentChannel.mobile_app,
  PaymentChannel.in_store,
  PaymentChannel.telephone,
  PaymentChannel.mail_order,
] as const satisfies ReadonlyArray<ObjectValues<typeof PaymentChannel>>;

const CounterpartySchema = z.object({
  correlationId: z.string(),
  endUser: z
    .object({
      correlationId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable(),
  business: z
    .object({
      correlationId: z.string(),
      companyName: z.string(),
    })
    .nullable(),
});

export const TransactionsListSchema = z.array(
  ObjectWithIdSchema.extend({
    transactionCorrelationId: z.string(),
    transactionDate: z.string().datetime(),
    transactionDirection: z.enum(TransactionDirections).nullable(),
    transactionAmount: z.number(),
    transactionCurrency: z.string(),
    transactionBaseAmount: z.number(),
    transactionBaseCurrency: z.string(),
    counterpartyOriginator: CounterpartySchema.nullable(),
    counterpartyOriginatorId: z.string().nullable(),
    counterpartyBeneficiary: CounterpartySchema.nullable(),
    counterpartyBeneficiaryId: z.string().nullable(),
    paymentMethod: z.enum(PaymentMethods).nullable(),
    paymentType: z.enum(PaymentTypes).nullable(),
    paymentChannel: z.string().nullable(),
    transactionStatus: z.enum(TransactionStatuses).nullable(),
    transactionType: z.enum(TransactionTypes).nullable(),
    transactionCategory: z.string().nullable(),
    originatorIpAddress: z.string().nullable(),
    originatorGeoLocation: z.string().nullable(),
    cardHolderName: z.string().nullable(),
    cardBin: z.number().nullable(),
    cardBrand: z.string().nullable(),
    cardIssuedCountry: z.string().nullable(),
    completed3ds: z.boolean().nullable(),
    cardType: z.string().nullable(),
    productName: z.string().nullable(),
  }).transform(({ counterpartyBeneficiary, counterpartyOriginator, ...data }) => {
    const counterpartyBeneficiaryName = counterpartyBeneficiary?.business
      ? counterpartyBeneficiary.business.companyName.trim()
      : counterpartyBeneficiary?.endUser
      ? `${counterpartyBeneficiary?.endUser?.firstName} ${counterpartyBeneficiary?.endUser?.lastName}`.trim()
      : null;
    const counterpartyBeneficiaryCorrelationId = counterpartyBeneficiary?.correlationId;
    const counterpartyOriginatorName = counterpartyOriginator?.business
      ? counterpartyOriginator.business.companyName.trim()
      : counterpartyOriginator?.endUser
      ? `${counterpartyOriginator?.endUser?.firstName} ${counterpartyOriginator?.endUser?.lastName}`.trim()
      : null;
    const counterpartyOriginatorCorrelationId = counterpartyOriginator?.correlationId;

    return {
      ...data,
      counterpartyBeneficiaryName,
      counterpartyBeneficiaryCorrelationId,
      counterpartyOriginatorName,
      counterpartyOriginatorCorrelationId,
    };
  }),
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
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/transactions/by-alert?${queryParams}`,
    method: Method.GET,
    schema: TransactionsListSchema,
  });

  return handleZodError(error, alerts);
};
