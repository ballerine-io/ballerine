import { TransactionDirection, PaymentMethod, TransactionRecordType } from '@prisma/client';
import { AggregateType } from './consts';
import { AggregateType, TIME_UNITS } from './consts';

export type InlineRule = {
  id: string;
  fnName: string;
  options:
    | TransactionsAgainstDynamicRulesType
    | TDormantAccountOption
    | TCustomersTransactionTypeOptions;
  subjects: any;
  // subjects: readonly string[];
};

export type TAggregations = keyof typeof AggregateType;

export type TExcludedCounterparty = {
  counterpartyBeneficiaryIds: string[];
  counterpartyOriginatorIds: string[];
};

export type TimeUnit = (typeof TIME_UNITS)[keyof typeof TIME_UNITS];

export type TransactionsAgainstDynamicRulesType = {
  projectId?: string;
  havingAggregate?: TAggregations;
  amountBetween?: { min: number; max: number };
  timeAmount?: number;
  transactionType?: TransactionRecordType[];
  timeUnit?: TimeUnit;
  direction?: TransactionDirection;
  excludedCounterparty?: TExcludedCounterparty;
  paymentMethods?: PaymentMethod[];
  excludePaymentMethods?: boolean;
  days?: number;
  amountThreshold?: number;
  groupBy?: string[];
};

export type TDormantAccountOption = {
  projectId: string;
};

export type TCustomersTransactionTypeOptions = {
  projectId?: string; // TODO: make it required
  transactionType?: TransactionRecordType[];
  threshold?: number;
  paymentMethods?: PaymentMethod[];
  timeAmount?: number;
  timeUnit?: TimeUnit;
  isPerBrand?: boolean;
  havingAggregate?: TAggregations;
};

export type EvaluateFunctions = {
  evaluateTransactionsAgainstDynamicRules: (
    options: TransactionsAgainstDynamicRulesType,
  ) => Promise<any>;
  evaluateCustomersTransactionType: (options: TCustomersTransactionTypeOptions) => Promise<any>;
  // evaluateDormantAccount: (options: TDormantAccountOption) => Promise<any>;
};
