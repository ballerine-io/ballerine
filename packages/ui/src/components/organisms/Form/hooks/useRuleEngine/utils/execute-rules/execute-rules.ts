import { IRule } from '../../types';
import { executeRule } from '../execute-rule';

export const executeRules = (context: object, rules: Array<IRule<any, any>>) => {
  return rules.map(rule => ({
    rule,
    result: executeRule(context, rule as IRule),
  }));
};
