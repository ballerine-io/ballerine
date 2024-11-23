import { TProjectId } from '@/types';
import { TransactionDirection, PaymentMethod, TransactionRecordType } from '@prisma/client';
import { AggregateType, TIME_UNITS } from './consts';
import { Subject } from '@/alert/types';

export type InlineRule = {
  id: string;
  // TODO: Keep only Subject type
  subjects: ((Subject[] | readonly Subject[]) & string[]) | readonly string[];
} & (
  | {
      fnName: 'evaluateHighTransactionTypePercentage';
      fnInvestigationName: 'investigateHighTransactionTypePercentage';
      options: Omit<HighTransactionTypePercentage, 'projectId'>;
    }
  | {
      fnName: 'evaluateTransactionsAgainstDynamicRules';
      fnInvestigationName: 'investigateTransactionsAgainstDynamicRules';
      options: Omit<TransactionsAgainstDynamicRulesType, 'projectId'>;
    }
  | {
      fnName: 'evaluateCustomersTransactionType';
      fnInvestigationName: 'investigateCustomersTransactionType';
      options: Omit<TCustomersTransactionTypeOptions, 'projectId'>;
    }
  | {
      fnName: 'evaluateTransactionAvg';
      fnInvestigationName: 'investigateTransactionAvg';
      options: Omit<TransactionLimitHistoricAverageOptions, 'projectId'>;
    }
  | {
      fnName: 'evaluateTransactionAvg';
      fnInvestigationName: 'investigateTransactionAvg';
      options: Omit<TPeerGroupTransactionAverageOptions, 'projectId'>;
    }
  | {
      fnName: 'evaluateDormantAccount';
      fnInvestigationName: 'investigateDormantAccount';
      options: Omit<TDormantAccountOptions, 'projectId'>;
    }
  | {
      fnName: 'checkMerchantOngoingAlert';
      fnInvestigationName?: 'investigateMerchantOngoingAlert';
      options: CheckRiskScoreOptions;
    }
  | {
      fnName: 'evaluateHighVelocityHistoricAverage';
      fnInvestigationName: 'investigateHighVelocityHistoricAverage';
      options: Omit<HighVelocityHistoricAverageOptions, 'projectId'>;
    }
  | {
      fnName: 'evaluateMultipleMerchantsOneCounterparty';
      fnInvestigationName: 'investigateMultipleMerchantsOneCounterparty';
      options: Omit<TMultipleMerchantsOneCounterparty, 'projectId'>;
    }
  | {
      fnName: 'evaluateMerchantGroupAverage';
      fnInvestigationName: 'investigateMerchantGroupAverage';
      options: Omit<TMerchantGroupAverage, 'projectId'>;
    }
  | {
      fnName: 'evaluateDailySingleTransactionAmount';
      fnInvestigationName: 'investigateDailySingleTransactionAmount';
      options: Omit<DailySingleTransactionAmountType, 'projectId'>;
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
  timeUnit: TimeUnit;
  timeAmount: number;
  transactionType?: TransactionRecordType[] | readonly TransactionRecordType[];
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
  subjectColumn: Subject;
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
  timeAmount: number;
  timeUnit: TimeUnit;
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

export type TMerchantGroupAverage = {
  projectId: TProjectId;
  customerType?: string;
  timeAmount: number;
  timeUnit: TimeUnit;
  paymentMethod: {
    value: PaymentMethod;
    operator: '=' | '!=';
  };
  minimumCount: number;
  transactionFactor: number;
};

export type DailySingleTransactionAmountType = {
  projectId: TProjectId;

  ruleType: 'amount' | 'count'; // Either monitor by amount or by count

  amountThreshold?: number;

  timeUnit: TimeUnit;
  timeAmount: number;

  transactionType?: TransactionRecordType[] | readonly TransactionRecordType[];

  direction: TransactionDirection;

  paymentMethods: PaymentMethod[] | readonly PaymentMethod[];
  excludePaymentMethods: boolean;
};
