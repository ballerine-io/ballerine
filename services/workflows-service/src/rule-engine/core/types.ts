import { EngineErrors } from './errors';
import { OPERATION, OPERATOR } from './operators/enums';

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

export type PassedRuleResult = {
  status: 'PASSED' | 'SKIPPED';
  message?: string;
  passed: boolean;
  error?: never; // 'error' should not be present
  rules?: Rule | RuleSet; // 'rules' should be present
};

export type FailedRuleResult = {
  status: 'FAILED';
  message?: string;
  passed: boolean;
  error: EngineErrors | undefined; // 'error' should be present
};

export type RuleResult = PassedRuleResult | FailedRuleResult;

export type RuleResultSet = RuleResult[];
