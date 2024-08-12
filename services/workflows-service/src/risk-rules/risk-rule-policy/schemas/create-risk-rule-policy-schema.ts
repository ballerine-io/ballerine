import { Static, Type } from '@sinclair/typebox';

export const CreateRiskRulePolicySchema = Type.Object({
  name: Type.String({
    description: 'Name of the risk rule policy',
    examples: ['High Risk Transaction Policy'],
  }),
});

export type TCreateRiskRulePolicy = Static<typeof CreateRiskRulePolicySchema>;
