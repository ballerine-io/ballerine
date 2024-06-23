import { EngineErrors } from './errors';
import { OPERATOR, OPERATION } from './operators/enums';

export type TOperation = (typeof OPERATION)[keyof typeof OPERATION];
export type TOperator = (typeof OPERATOR)[keyof typeof OPERATOR];

export type Rule = {
  key: string;
  operation: TOperation;
  value: any; // This should be a union of all possible values for the operation
};

export type RuleSet = {
  operator: TOperator;
  rules: Array<Rule | RuleSet>;
};

type PassedRuleResult = {
  status: 'PASSED' | 'SKIPPED';
  message?: string;
  passed: boolean;
  // error?: never;  // 'error' should not be present
};

type FailedRuleResult = {
  status: 'FAILED';
  message?: string;
  passed: boolean;
  error: EngineErrors; // 'error' must be present
};

export type RuleResult = PassedRuleResult | FailedRuleResult;

export type ValidationResultSet = {
  [key: string]: RuleResult;
};
