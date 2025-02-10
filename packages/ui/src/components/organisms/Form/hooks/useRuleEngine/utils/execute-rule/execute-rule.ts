import { getRuleEngineRunner } from '../../rule-engine.repository';
import { IRule } from '../../types';

export const executeRule = (context: object, rule: IRule<any, any>) => {
  const runEngine = getRuleEngineRunner(rule.engine);

  return runEngine(context, rule);
};
