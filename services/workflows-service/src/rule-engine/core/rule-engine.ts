import { OPERATION, OPERATOR } from './operators/enums';
import { OperationNotFoundError, DataValueNotFoundError, MissingKeyError } from './errors';
import { Rule, RuleResult, RuleSet, RuleResultSet, FailedRuleResult } from './types';
import { operationHelpers } from './operators/constants';
import { get, isEmpty } from 'lodash';
import { error } from 'console';

export const validateRule = (rule: Rule, data: any): RuleResult => {
  if (isEmpty(rule.key)) {
    throw new MissingKeyError();
  }

  // TODO: we might want to extract the key value in the rule itself?
  const value = get(data, rule.key);

  if (value === undefined || value === null) {
    throw new DataValueNotFoundError(rule.key);
  }

  const operation = operationHelpers[rule.operation];

  if (!operation) {
    throw new OperationNotFoundError(rule.operation);
  }

  try {
    const result = operation.execute(value, rule.value);

    return { status: result ? 'PASSED' : 'FAILED', passed: result, error: undefined };
  } catch (error) {
    if (error instanceof Error) {
      return { status: 'FAILED', message: error.message, passed: false, error };
    }

    throw error;
  }
};

export const validateRuleSet = (ruleSet: RuleSet, data: any): RuleResultSet => {
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
            passed: false,
            error,
            rule,
          };
        } else {
          throw error;
        }
      }
    } else {
      // RuleSet
      const nestedResults = validateRuleSet(rule, data);

      const passed =
        rule.operator === OPERATOR.AND
          ? nestedResults.every(r => r.passed)
          : nestedResults.some(r => r.passed);

      const status = passed ? 'PASSED' : 'SKIPPED';

      return {
        passed,
        status,
        message: JSON.stringify(nestedResults),
        rule,
      };
    }
  });
};
