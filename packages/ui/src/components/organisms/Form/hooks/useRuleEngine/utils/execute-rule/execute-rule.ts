import { getRuleEngineRunner } from '../../rule-engine.repository';
import { TRule } from '@ballerine/common';

export const executeRule = (context: object, rule: TRule) => {
  const runEngine = getRuleEngineRunner(rule.engine);

  return runEngine(context, rule);
};
