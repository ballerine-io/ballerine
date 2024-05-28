import { TProjectId } from '@/types';
import { TransactionDirection, PaymentMethod, TransactionRecordType } from '@prisma/client';
import { AggregateType, TIME_UNITS } from './consts';

export type InlineRule = {
  id: string;
  subjects: string[] | readonly string[];
} & (
  | {
      fnName: 'evaluateHighTransactionTypePercentage';
      options: Omit<HighTransactionTypePercentage, 'projectId'>;
    }
  | {
      fnName: 'evaluateTransactionsAgainstDynamicRules';
      options: Omit<TransactionsAgainstDynamicRulesType, 'projectId'>;
    }
  | {
      fnName: 'evaluateCustomersTransactionType';
      options: Omit<TCustomersTransactionTypeOptions, 'projectId'>;
    }
  | {
      fnName: 'evaluateTransactionAvg';
      options: Omit<TransactionLimitHistoricAverageOptions, 'projectId'>;
    }
  | {
      fnName: 'evaluateTransactionAvg';
      options: Omit<TPeerGroupTransactionAverageOptions, 'projectId'>;
    }
  | {
      fnName: 'evaluateDormantAccount';
      options: Omit<TDormantAccountOptions, 'projectId'>;
    }
  | {
      fnName: 'checkMerchantOngoingAlert';
      options: CheckRiskScoreOptions;
    }
  | {
      fnName: 'evaluateHighVelocityHistoricAverage';
      options: Omit<HighVelocityHistoricAverageOptions, 'projectId'>;
    }
  | {
      fnName: 'evaluateMultipleMerchantsOneCounterparty';
      options: Omit<TMultipleMerchantsOneCounterparty, 'projectId'>;
    }
);

export type TAggregations = keyof typeof AggregateType;

export type TExcludedCounterparty = {
  counterpartyBeneficiaryIds: string[] | readonly string[];
  counterpartyOriginatorIds: string[] | readonly string[];
};

export type TimeUnit = (typeof TIME_UNITS)[keyof typeof TIME_UNITS];

export type TransactionsAgainstDynamicRulesType = {
  projectId: TProjectId;
  havingAggregate?: TAggregations;
  amountBetween?: { min: number; max: number };
  timeAmount?: number;
  transactionType?: TransactionRecordType[] | readonly TransactionRecordType[];
  timeUnit?: TimeUnit;
  direction?: TransactionDirection;
  excludedCounterparty?: TExcludedCounterparty;
  paymentMethods?: PaymentMethod[] | readonly PaymentMethod[];
  excludePaymentMethods?: boolean;
  days?: number;
  amountThreshold?: number;
  groupBy?: string[] | readonly string[];
};

export type HighTransactionTypePercentage = {
  projectId: TProjectId;
  transactionType: TransactionRecordType;
  subjectColumn: 'counterpartyOriginatorId' | 'counterpartyBeneficiaryId';
  minimumCount: number;
  minimumPercentage: number;
  timeAmount: number;
  timeUnit: TimeUnit;
};

export type TCustomersTransactionTypeOptions = {
  projectId: TProjectId;
  transactionType?: TransactionRecordType[] | readonly TransactionRecordType[];
  threshold?: number;
  paymentMethods?: PaymentMethod[] | readonly PaymentMethod[];
  timeAmount?: number;
  timeUnit?: TimeUnit;
  isPerBrand?: boolean;
  havingAggregate?: TAggregations;
};

export type TransactionLimitHistoricAverageOptions = {
  projectId: TProjectId;
  transactionDirection: TransactionDirection;
  paymentMethod: {
    value: PaymentMethod;
    operator: '=' | '!=';
  };
  minimumCount: number;
  minimumTransactionAmount: number;
  transactionFactor: number;
};

export type CheckRiskScoreOptions = {
  increaseRiskScorePercentage?: number;
  increaseRiskScore?: number;
  maxRiskScoreThreshold?: number;
};

export type TPeerGroupTransactionAverageOptions = TransactionLimitHistoricAverageOptions & {
  customerType?: string;
  timeUnit?: TimeUnit;
  timeAmount?: number;
};

export type TDormantAccountOptions = {
  projectId: TProjectId;
  timeAmount: number;
  timeUnit: TimeUnit;
};

export type HighVelocityHistoricAverageOptions = {
  projectId: TProjectId;
  transactionDirection: TransactionDirection;
  transactionFactor: number;
  minimumCount: number;
  paymentMethod: {
    value: PaymentMethod;
    operator: '=' | '!=';
  };
  activeUserPeriod: {
    timeAmount: number;
  };
  lastDaysPeriod: {
    timeAmount: number;
  };
  timeUnit: TimeUnit;
};

export type TMultipleMerchantsOneCounterparty = {
  projectId: TProjectId;
  excludedCounterparty?: TExcludedCounterparty;
  minimumCount: number;
  timeAmount: number;
  timeUnit: TimeUnit;
};
