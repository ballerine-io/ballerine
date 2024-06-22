import { conditionHelpers } from './condition/constants';
import { ConditionOperator } from './condition/enums';
import {
  ICondition,
  IConditionHelpers,
  IConditionResult,
  IRule,
  IRuleResult,
  RuleSet,
  RuleSetResult,
} from './types';

const evaluateCondition = (
  data: any,
  condition: ICondition,
  helpers: IConditionHelpers,
): IConditionResult => {
  const value = data[condition.key];

  const helperFn = helpers[condition.type];

  if (!helperFn) {
    throw new Error(`No helper found for condition type ${condition.type}`);
  }

  const passed = helperFn(value, condition.value, condition);

  let nestedConditionResults: { [key: string]: IConditionResult } | undefined;

  if (condition.conditions) {
    const nestedResultsArray = condition.conditions.map(nestedCondition =>
      evaluateCondition(data, nestedCondition, helpers),
    );

    nestedConditionResults = nestedResultsArray.reduce((acc, cur) => {
      acc[cur.key] = cur;
      return acc;
    }, {} as { [key: string]: IConditionResult });

    const operator = condition.operator || ConditionOperator.AND;

    const nestedPassed =
      operator === ConditionOperator.AND
        ? nestedResultsArray.every(cr => cr.passed)
        : nestedResultsArray.some(cr => cr.passed);

    return {
      key: condition.key,
      value,
      passed: passed && nestedPassed,
      conditionResults: nestedConditionResults,
    };
  }

  return { key: condition.key, value, passed };
};

const evaluateRule = (data: any, rule: IRule, helpers: IConditionHelpers): IRuleResult => {
  const conditionResultsArray = rule.conditions.map(condition =>
    evaluateCondition(data, condition, helpers),
  );

  const ruleResults = conditionResultsArray.reduce((acc, cur) => {
    acc[cur.key] = cur;
    return acc;
  }, {} as { [key: string]: IConditionResult });

  const operator = rule.operator || ConditionOperator.AND; // Default to 'and' if operator is not provided

  const passed =
    operator === ConditionOperator.AND
      ? conditionResultsArray.every(cr => cr.passed)
      : conditionResultsArray.some(cr => cr.passed);

  return { id: rule.id, passed, ruleResults };
};

const runRuleEngine = (
  data: any,
  ruleSet: RuleSet,
  helpers: IConditionHelpers = conditionHelpers,
): RuleSetResult => {
  return ruleSet.map(rule => evaluateRule(data, rule, helpers));
};

export const RuleEngine = (ruleSets: RuleSet, helpers: IConditionHelpers = conditionHelpers) => {
  const allHelpers = { ...helpers, ...conditionHelpers };

  const run = (data: object = {}) => {
    return runRuleEngine(data, ruleSets, allHelpers);
  };

  return {
    run,
  };
};
