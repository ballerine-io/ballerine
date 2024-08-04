import { Type } from '@sinclair/typebox';
// eslint-disable-next-line import/namespace
import { CreateRiskRuleSchema } from './create-risk-rule.schema';

export const CreateRuleSetSchema = Type.Object({
  workflowDefinitionId: Type.String({
    description: 'The unique key of the parameter  for the rule',
  }),
  riskRules: Type.Array(CreateRiskRuleSchema, { description: 'The Rules to create the policy' }),
});
