import isEmpty from 'lodash.isempty';

import { DataValueNotFoundError, MissingKeyError, OperatorNotFoundError } from '../errors';

import { OperationHelpers } from '../operators/constants';
import { OPERATOR } from '../operators/enums';

import { Rule, RuleResult, RuleResultSet, RuleSet } from '../types';

export const validateRule = (rule: Rule, data: any): RuleResult => {
  if (isEmpty(rule.key)) {
    throw new MissingKeyError();
  }

  const operator = OperationHelpers[rule.operator];

  if (!operator) {
    throw new OperatorNotFoundError(rule.operator);
  }

  const value = operator.extractValue(data, rule);

  try {
    // @ts-expect-error - genereic type value is not assignable to any
    const result = operator.execute(value, rule.value);

    return { status: result ? 'PASSED' : 'FAILED', error: undefined };
  } catch (error) {
    if (error instanceof Error) {
      return { status: 'FAILED', message: error.message, error };
    }

    throw error;
  }
};

export const runRuleSet = (ruleSet: RuleSet, data: any): RuleResultSet => {
  return ruleSet.rules.map(rule => {
    if ('key' in rule) {
      // Rule
      try {
        return { ...validateRule(rule, data), rule };
      } catch (error) {
        // TODO: Would we want to throw when error instanceof OperationNotFoundError?
        if (error instanceof Error) {
          return {
            status: 'FAILED',
            message: error.message,
            error,
            rule,
          };
        } else {
          throw error;
        }
      }
    } else {
      // RuleSet
      const nestedResults = runRuleSet(rule, data);

      const passed =
        rule.operator === OPERATOR.AND
          ? nestedResults.every(r => r.status === 'PASSED')
          : nestedResults.some(r => r.status === 'PASSED');

      const status = passed ? 'PASSED' : 'SKIPPED';

      return {
        status,
        rule,
      };
    }
  });
};

export const RuleEngine = (ruleSets: RuleSet, helpers?: typeof OperationHelpers) => {
  // TODO: inject helpers
  const allHelpers = { ...(helpers || {}), ...OperationHelpers };

  const run = (data: object) => {
    return runRuleSet(ruleSets, data);
  };

  return {
    run,
  };
};
