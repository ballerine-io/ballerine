import { OPERATION, OPERATOR } from './operators/enums';
import {
  OperationNotFoundError,
  DataValueNotFoundError,
  MissingKeyError,
  ValidationFailedError,
  EngineErrors,
} from './errors';
import { z } from 'zod';
import { Rule, RuleResult, RuleSet, ValidationResultSet } from './types';
import { operationHelpers } from './operators/constants';

export const validateRule = (rule: Rule, data: any): RuleResult => {
  if (!rule.key) {
    throw new MissingKeyError(rule.key);
  }

  // TODO: we might want to extract the key value in the rule itself?
  const value = data[rule.key];

  if (value === undefined || value === null) {
    throw new DataValueNotFoundError(rule.key);
  }

  const operation = operationHelpers[rule.operation];

  if (!operation) {
    throw new OperationNotFoundError(rule.operation);
  }

  const result = operation.execute(value, rule.value);

  if (!result) {
    const error = new ValidationFailedError(rule.key, rule.operation);
    return { status: 'FAILED', message: error.message, passed: false, error };
  }

  return { status: 'PASSED', passed: true };
};

export const validateRuleSet = (
  ruleSet: RuleSet,
  data: any,
  depth: number = 0,
): ValidationResultSet => {
  const results: ValidationResultSet = {};

  for (const rule of ruleSet.rules) {
    if ('key' in rule) {
      try {
        const result = validateRule(rule, data);
        results[`${rule.key}_${depth}`] = result;
        if (ruleSet.operator === OPERATOR.AND && result.status === 'FAILED') {
          break;
        }
      } catch (error) {
        // TODO: Would we want to throw when error instanceof OperationNotFoundError?
        if (error instanceof Error) {
          results[`${rule.key}_${depth}`] = {
            status: 'FAILED',
            message: error.message,
            passed: false,
            error,
          };
        } else {
          throw error;
        }
      }
    } else {
      const nestedResults = validateRuleSet(rule, data, depth + 1);

      const passed =
        ruleSet.operator === 'and'
          ? Object.values(nestedResults).every(r => r.status === 'PASSED')
          : Object.values(nestedResults).some(r => r.status === 'PASSED');

      results[`nested_${depth}`] = {
        passed,
        status: passed ? 'PASSED' : 'SKIPPED',
        message: JSON.stringify(nestedResults),
      };
      if (ruleSet.operator === 'and' && passed) {
        break;
      }
    }
  }

  return results;
};
