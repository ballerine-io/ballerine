import { TransactionDirection, PaymentMethod, TransactionRecordType } from '@prisma/client';
import { AggregateType } from './consts';
import { GenericAsyncFunction } from '@/types';

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

export type TransactionsAgainstDynamicRulesType = {
  projectId?: string;
  havingAggregate?: TAggregations;
  amountBetween?: { min: number; max: number };
  timeAmount?: number;
  timeUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  direction?: TransactionDirection;
  excludedCounterparty?: {
    counterpartyBeneficiaryIds: string[];
    counterpartyOriginatorIds: string[];
  };
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
  projectId: string; // TODO: make it required
  transactionType?: TransactionRecordType[];
  threshold?: number;
  paymentMethods?: PaymentMethod[];
  timeAmount?: number;
  timeUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  isPerBrand?: boolean;
  havingAggregate?: TAggregations;
};

export type EvaluateFunctions = {
  evaluateTransactionsAgainstDynamicRules: (
    options: TransactionsAgainstDynamicRulesType,
  ) => Promise<any>;
  // evaluateDormantAccount: (options: TDormantAccountOption) => Promise<any>;
  // evaluateCustomersTransactionType: (options: TCustomersTransactionTypeOptions) => Promise<any>;
};
