import { Static, Type } from '@sinclair/typebox';
import { TypeStringEnum } from '@/helpers/type-box/type-string-enum';
import { RulesetOperator, IndicatorRiskLevel } from '@prisma/client';

export const CreateRiskRuleSchema = Type.Object({
  name: Type.String({
    description: 'Name of the risk rule',
    examples: ['High Transaction Amount Risk'],
  }),
  riskRulePolicyId: Type.String({
    description: 'The ID of the associated risk rule policy',
  }),
  operator: TypeStringEnum(Object.values(RulesetOperator), 'The operator for the risk rule'),
  domain: Type.String({
    description: 'The domain of the risk rule',
    examples: ['transaction'],
  }),
  indicator: Type.String({
    description: 'The indicator for the risk rule',
    examples: ['Amount'],
  }),
  riskLevel: TypeStringEnum(Object.values(IndicatorRiskLevel), 'The risk level for the rule'),
  baseRiskScore: Type.Number({
    minimum: 0,
    maximum: 100,
    description: 'The base risk score for the rule',
  }),
  additionalRiskScore: Type.Number({
    minimum: 0,
    maximum: 100,
    description: 'The additional risk score for the rule',
  }),
  minRiskScore: Type.Optional(
    Type.Number({
      minimum: 0,
      maximum: 100,
      description: 'The minimum risk score (optional)',
    }),
  ),
  maxRiskScore: Type.Optional(
    Type.Number({
      minimum: 0,
      maximum: 100,
      description: 'The maximum risk score (optional)',
    }),
  ),
  ruleSetId: Type.Optional(
    Type.String({
      minimum: 0,
      maximum: 100,
      description: 'The ID of the ruleset to connect the risk rule to (optional)',
    }),
  ),
});

export type TCreateRiskRule = Static<typeof CreateRiskRuleSchema>;
