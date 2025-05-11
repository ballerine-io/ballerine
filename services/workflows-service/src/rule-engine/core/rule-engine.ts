import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import {
  isObject,
  OperationHelpers,
  OPERATOR,
  OperatorNotFoundError,
  OPERATORS_WITH_THRESHOLD,
  Rule,
  RuleResult,
  RuleResultSet,
  RuleSchema,
  RuleSet,
  TWorkflowHelpers,
  ValidationFailedError,
} from '@ballerine/common';

export const validateRule = async (
  rule: Rule,
  data: any,
  { helpers, unifiedApiClient }: { helpers: TWorkflowHelpers; unifiedApiClient: UnifiedApiClient },
): Promise<RuleResult> => {
  const validateRuleResult = RuleSchema.safeParse(rule);

  if (!validateRuleResult.success) {
    throw new ValidationFailedError('rule', 'parsing failed', validateRuleResult.error);
  }

  const validRule = validateRuleResult.data;

  const operator = OperationHelpers[validRule.operator as keyof typeof OperationHelpers];

  if (!operator) {
    throw new OperatorNotFoundError(rule.operator);
  }

  const { value, comparisonValue } = await extractValuesForComparison(
    operator,
    data,
    validRule,
    helpers,
  );

  const thresholdValue = getThresholdIfRequired(validRule);

  try {
    const result = await operator.execute(value, comparisonValue, {
      unifiedApiClient,
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

const extractValuesForComparison = async (
  operator: any,
  data: any,
  rule: Rule,
  helpers: TWorkflowHelpers,
) => {
  const extractedValueBeforeAwait = operator.extractValue(data, rule, { helpers });

  const extractedValue =
    extractedValueBeforeAwait instanceof Promise
      ? await extractedValueBeforeAwait
      : extractedValueBeforeAwait;

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
  options: { helpers: TWorkflowHelpers; unifiedApiClient: UnifiedApiClient },
): Promise<RuleResultSet> => {
  return Promise.all(
    ruleSet.rules.map(async rule => {
      if ('rules' in rule) {
        // RuleSet
        const nestedResults = await runRuleSet(rule, data, {
          helpers: options.helpers,
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
            ...(await validateRule(rule, data, {
              helpers: options.helpers,
              unifiedApiClient: options.unifiedApiClient,
            })),
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

  const run = async (data: object, helpers: TWorkflowHelpers): Promise<RuleResultSet> => {
    return await runRuleSet(ruleSets, data, { helpers, unifiedApiClient });
  };

  return { run };
};
