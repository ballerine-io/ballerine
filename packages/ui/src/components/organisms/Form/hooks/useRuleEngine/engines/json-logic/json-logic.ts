import jsonLogic from 'json-logic-js';
import { TRuleEngineRunner } from '../../types';
import { TRule } from '@ballerine/common';

export const jsonLogicEngineRunner: TRuleEngineRunner = (context: object, rule: TRule) => {
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
