import { TRule } from '@ballerine/common';

export type TRuleEngineRunner = (context: object, rule: TRule) => boolean;

export interface IRuleExecutionResult {
  rule: TRule;
  result: boolean;
}
