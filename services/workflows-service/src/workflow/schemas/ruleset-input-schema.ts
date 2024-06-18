import { z } from 'zod';
import {
  CustomRuleCastOptions,
  CustomRuleOperations,
  CustomRulesTypes,
} from '@ballerine/rules-engine-lib';
import { logger } from '@ballerine/workflow-core';

const RiskScoreOptions = ['critical', 'moderate', 'positive'] as const;

export const CUSTOM_TABLE_COLUMN_RULE_VIOLATION_RULE = z.object({
  id: z.string(),
  rule_type: z.enum(CustomRulesTypes),
  rule_operation: z.enum(CustomRuleOperations).optional(),
  field_path: z.string().optional(),
  compare_value: z.string().optional(),
  cast: z.enum(CustomRuleCastOptions).optional(),
  ruleset_operator: z.enum(['or', 'and']).optional(),
  name: z.string(),
  domain: z.string(),
  risk_level: z.enum(RiskScoreOptions),
  trigger_on: z.string(),
  base_risk_score: z.number().min(0).max(100),
  addition_risk_score: z.number().min(-50).max(50),
  transaction_laundering_risk: z.enum(RiskScoreOptions).optional(),
  chargeback_risk: z.enum(RiskScoreOptions).optional(),
  legal_risk: z.enum(RiskScoreOptions).optional(),
  reputation_risk: z.enum(RiskScoreOptions).optional(),
});

export const CUSTOM_VIOLATION_RULES_SCHEMA = z
  .array(CUSTOM_TABLE_COLUMN_RULE_VIOLATION_RULE)
  .transform(violation =>
    violation.map(violationRiskScore => {
      const isFulfilledRiskScore =
        CUSTOM_TABLE_COLUMN_RULE_VIOLATION_RULE.safeParse(violationRiskScore).success;
      if (!isFulfilledRiskScore) {
        logger.warn(`Invalid violation risk score: ${violationRiskScore.id}`);

        return;
      }

      return violationRiskScore;
    }),
  );
