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
} from '@ballerine/common';

export const validateRule = (rule: Rule, data: any): RuleResult => {
  const result = RuleSchema.safeParse(rule);

  if (!result.success) {
    throw new ValidationFailedError('rule', 'parsing failed', result.error);
  }

  const operator = OperationHelpers[rule.operator as keyof typeof OperationHelpers];

  if (!operator) {
    throw new OperatorNotFoundError(rule.operator);
  }

  const value = operator.extractValue(data, rule);

  try {
    // @ts-expect-error - rule
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
    if ('rules' in rule) {
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
    } else {
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
