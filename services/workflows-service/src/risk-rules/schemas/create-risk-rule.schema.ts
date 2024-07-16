import { Type } from '@sinclair/typebox';
import { CreateRuleSetSchema } from '@/risk-rules/schemas/create-rule-set.schema';
import { IndicatorRiskLevel } from '@prisma/client';
import { TypeStringEnum } from '@/helpers/type-box/type-string-enum';

export const CreateRiskRuleSchema = Type.Object({
  ruleSet: CreateRuleSetSchema,
  domain: Type.String({
    description: 'The domain of the rule',
  }),
  indicator: Type.String({
    description: 'The indicator name of the rule',
  }),
  riskLevel: TypeStringEnum(
    [IndicatorRiskLevel.positive, IndicatorRiskLevel.moderate, IndicatorRiskLevel.critical],
    'The risk level of the rule',
  ),
  baseRiskScore: Type.Number({
    description: 'The base risk score, as the highest base of all rulesets',
    minimum: 0,
    maximum: 100,
  }),
  additionalRiskScore: Type.Number({
    description: 'The additional risk score, as the highest additional of all rulesets',
    minimum: 0,
    maximum: 100,
  }),
  minRiskScore: Type.Number({
    description: 'The minimum risk score, the minimum total risk score if the rule is met',
    minimum: 0,
    maximum: 100,
  }),
  maxRiskScore: Type.Number({
    description: 'The maximum risk score in which this rule is relevant',
    minimum: 0,
    maximum: 100,
  }),
});
