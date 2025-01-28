import jsonLogic from 'json-logic-js';
import { IRule, TRuleEngineRunner } from '../../types';

export const jsonLogicEngineRunner: TRuleEngineRunner = (context: object, rule: IRule) => {
  if (typeof rule.value !== 'object' || rule.value === null) {
    throw new Error('JsonLogicEngineRunner: Rule value must be an object');
  }

  const result = jsonLogic.apply(rule.value, context);

  if (typeof result !== 'boolean') {
    console.warn('JsonLogicEngineRunner: Rule result is not a boolean', result);
    console.warn('Result will be converted to boolean');
  }

  return Boolean(result);
};
