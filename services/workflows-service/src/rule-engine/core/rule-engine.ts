import {
  Rule,
  RuleResult,
  RuleResultSet,
  RuleSet,
  OperatorNotFoundError,
  OperationHelpers,
  OPERATOR,
  RuleSchema,
  ValidationFailedError,
  isObject,
  OPERATORS_WITH_THRESHOLD,
} from '@ballerine/common';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';

export const validateRule = (
  rule: Rule,
  data: any,
  options: { unifiedApiClient: UnifiedApiClient },
): RuleResult => {
  const result = RuleSchema.safeParse(rule);

  if (!result.success) {
    throw new ValidationFailedError('rule', 'parsing failed', result.error);
  }

  const operator = OperationHelpers[rule.operator as keyof typeof OperationHelpers];

  if (!operator) {
    throw new OperatorNotFoundError(rule.operator);
  }

  const extractedValue = operator.extractValue(data, rule);

  const isPathComparison =
    isObject(extractedValue) && 'value' in extractedValue && 'comparisonValue' in extractedValue;

  const { value, comparisonValue } = isPathComparison
    ? extractedValue
    : { value: extractedValue, comparisonValue: rule.value };

  const ruleThresholdValue =
    OPERATORS_WITH_THRESHOLD.includes(rule.operator as (typeof OPERATORS_WITH_THRESHOLD)[number]) &&
    'threshold' in rule
      ? rule.threshold
      : undefined;

  try {
    const result = operator.execute(value, comparisonValue, {
      unifiedApiClient: options.unifiedApiClient,
      threshold: ruleThresholdValue,
    });
    console.log('rule', rule, 'result', result);

    return { status: result ? 'PASSED' : 'FAILED', error: undefined };
  } catch (error) {
    if (error instanceof Error) {
      return { status: 'FAILED', message: error.message, error };
    }

    throw error;
  }
};

export const runRuleSet = (
  ruleSet: RuleSet,
  data: any,
  options: { unifiedApiClient: UnifiedApiClient },
): RuleResultSet => {
  return ruleSet.rules.map(rule => {
    if ('rules' in rule) {
      // RuleSet
      const nestedResults = runRuleSet(rule, data, {
        unifiedApiClient: options.unifiedApiClient,
      });

      const passed =
        rule.operator === OPERATOR.AND
          ? nestedResults.every(r => r.status === 'PASSED')
          : nestedResults.some(r => r.status === 'PASSED');

      const status = passed ? 'PASSED' : 'SKIPPED';

      return {
        status,
        rule,
      };
    } else {
      // Rule
      try {
        return {
          ...validateRule(rule, data, { unifiedApiClient: options.unifiedApiClient }),
          rule,
        };
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
    }
  });
};

export const RuleEngine = (ruleSets: RuleSet, helpers?: typeof OperationHelpers) => {
  // TODO: inject helpers
  const allHelpers = { ...(helpers || {}), ...OperationHelpers };
  const unifiedApiClient = new UnifiedApiClient();

  const run = (data: object) => {
    return runRuleSet(ruleSets, data, { unifiedApiClient });
  };

  return {
    run,
  };
};
