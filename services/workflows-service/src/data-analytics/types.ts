import { TransactionDirection, PaymentMethod } from '@prisma/client';
import { AggregateType } from './consts';

export type InlineRule = {
  name: string;
  options: TransactionsAgainstDynamicRulesType;
  groupedBy: Array<string>;
};

export type TAggregations = keyof typeof AggregateType;

export type TransactionsAgainstDynamicRulesType = {
  havingAggregate?: TAggregations;
  amountBetween?: { min: number; max: number };
  timeAmount?: number;
  timeUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  direction?: TransactionDirection;
  excludedCounterpartyIds?: string[];
  paymentMethods?: PaymentMethod[];
  excludePaymentMethods?: boolean;
  days?: number;
  amountThreshold?: number;
  groupByBusiness?: boolean;
  groupByCounterparty?: boolean;
};
