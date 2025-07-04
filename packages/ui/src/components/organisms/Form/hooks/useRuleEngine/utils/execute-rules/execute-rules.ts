import { TRule } from '@ballerine/common';
import { executeRule } from '../execute-rule';

export const executeRules = (context: object, rules: Array<TRule>) => {
  return rules.map(rule => ({
    rule,
    result: executeRule(context, rule),
  }));
};
