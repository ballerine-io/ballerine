import { Rule, RuleSet } from './rules/types';
import { EngineErrors } from './errors';

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

export interface TFindAllRulesOptions {
  databaseId: string;
  source: 'notion';
}

export * from './operators/types';

export * from './rules/types';
