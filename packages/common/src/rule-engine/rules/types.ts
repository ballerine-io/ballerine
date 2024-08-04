import { z } from 'zod';
import { RuleSchema } from './schemas';
import { EngineErrors } from '../errors';
import { TOperator } from '../operators/types';

export type Rule = z.infer<typeof RuleSchema>;

export type RuleSet = {
  operator: TOperator;
  rules: Array<Rule | RuleSet>;
};

export type PassedRuleResult = {
  status: 'PASSED' | 'SKIPPED';
  message?: string;
  error?: never; // 'error' should not be present
  rules?: Rule | RuleSet; // 'rules' should be present
};

export type FailedRuleResult = {
  status: 'FAILED';
  message?: string;
  error: EngineErrors | undefined; // 'error' should be present
};

export type RuleResult = PassedRuleResult | FailedRuleResult;

export type RuleResultSet = RuleResult[];
