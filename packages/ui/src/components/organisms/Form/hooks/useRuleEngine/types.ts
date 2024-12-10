export type TRuleEngineRunner = (context: object, rule: IRule) => boolean;
export type TRuleEngine = 'json-logic' | 'json-schema';

export interface IRule<TRuleEngines = TRuleEngine, TParams = any> {
  engine: TRuleEngines;
  value: unknown;
  params?: TParams;
}

export interface IRuleExecutionResult {
  rule: IRule<any, any>;
  result: boolean;
}
