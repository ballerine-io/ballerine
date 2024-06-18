import {
  CUSTOM_TABLE_COLUMN_RULE_VIOLATION_RULE,
  CUSTOM_VIOLATION_RULES_SCHEMA,
} from '@/workflow/schemas/ruleset-input-schema';
import { z } from 'zod';
import { deepCamelKeys } from 'string-ts';
import { groupBy, pick } from 'lodash';

export type ViolationsWithRule = z.infer<typeof CUSTOM_VIOLATION_RULES_SCHEMA>;
export type ViolationWithRule = z.infer<typeof CUSTOM_TABLE_COLUMN_RULE_VIOLATION_RULE>;
export const formatRuleViolations = (violationsWithRules: ViolationsWithRule) => {
  const formattedViolationsWithRules = violationsWithRules
    .filter(Boolean)
    .map((violationWithRule: NonNullable<ViolationWithRule>) => {
      return deepCamelKeys(violationWithRule);
    });

  return Object.entries(groupBy(formattedViolationsWithRules, 'id')).map(([ruleId, violations]) => {
    const commonRuleValue = violations[0];
    // typscript... this cannot happen
    if (!commonRuleValue) {
      return;
    }

    const ruleSetOperator = commonRuleValue.rulesetOperator || 'and';

    const rules = violations.map(({ ruleType, fieldPath, ruleOperation, cast, compareValue }) => {
      return {
        type: ruleType,
        options: {
          fieldPath,
          operations: ruleOperation,
          cast,
          compareValue,
        } as const,
      } as const;
    });

    return {
      id: ruleId,
      ...pick(commonRuleValue, [
        'name',
        'domain',
        'riskLevel',
        'triggerOn',
        'baseRiskScore',
        'additionRiskScore',
        'transactionLaunderingRisk',
        'chargebackRisk',
        'legalRisk',
        'reputationRisk',
      ]),
      ruleSet: {
        rules,
        operator: ruleSetOperator,
      },
    };
  });
};
