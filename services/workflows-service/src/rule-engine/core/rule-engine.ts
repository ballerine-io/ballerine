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

export const validateRule = async (
  rule: Rule,
  data: any,
  options: { unifiedApiClient: UnifiedApiClient },
): Promise<RuleResult> => {
  const validateRuleResult = RuleSchema.safeParse(rule);

  if (!validateRuleResult.success) {
    throw new ValidationFailedError('rule', 'parsing failed', validateRuleResult.error);
  }

  const operator = OperationHelpers[rule.operator as keyof typeof OperationHelpers];

  if (!operator) {
    throw new OperatorNotFoundError(rule.operator);
  }

  const { value, comparisonValue } = extractValuesForComparison(operator, data, rule);

  const thresholdValue = getThresholdIfRequired(rule);

  try {
    const result = await operator.execute(value, comparisonValue, {
      unifiedApiClient: options.unifiedApiClient,
      threshold: thresholdValue ?? 0,
    });

    return { status: result ? 'PASSED' : 'FAILED', error: undefined };
  } catch (error) {
    if (error instanceof Error) {
      return { status: 'FAILED', message: error.message, error };
    }

    throw error;
  }
};

const extractValuesForComparison = (operator: any, data: any, rule: Rule) => {
  const extractedValue = operator.extractValue(data, rule);

  const isPathComparison =
    isObject(extractedValue) && 'value' in extractedValue && 'comparisonValue' in extractedValue;

  return isPathComparison ? extractedValue : { value: extractedValue, comparisonValue: rule.value };
};

const getThresholdIfRequired = (rule: Rule) => {
  return OPERATORS_WITH_THRESHOLD.includes(
    rule.operator as (typeof OPERATORS_WITH_THRESHOLD)[number],
  ) && 'threshold' in rule
    ? rule.threshold
    : undefined;
};

export const runRuleSet = (
  ruleSet: RuleSet,
  data: any,
  options: { unifiedApiClient: UnifiedApiClient },
): Promise<RuleResultSet> => {
  return Promise.all(
    ruleSet.rules.map(async rule => {
      if ('rules' in rule) {
        // RuleSet
        const nestedResults = await runRuleSet(rule, data, {
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
            ...(await validateRule(rule, data, { unifiedApiClient: options.unifiedApiClient })),
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
    }),
  );
};

export const createRuleEngine = (
  ruleSets: RuleSet,
  options?: {
    helpers?: typeof OperationHelpers;
    unifiedApiClient?: UnifiedApiClient;
  },
) => {
  // TODO: inject helpers
  const allHelpers = { ...(options?.helpers || {}), ...OperationHelpers };

  const unifiedApiClient = options?.unifiedApiClient || new UnifiedApiClient();

  const run = async (data: object): Promise<RuleResultSet> => {
    return await runRuleSet(ruleSets, data, { unifiedApiClient });
  };

  return { run };
};
