import { Static, Type } from '@sinclair/typebox';

export const UpdateRiskRulePolicySchema = Type.Partial(
  Type.Object({
    name: Type.String({
      description: 'Name of the risk rule policy',
      examples: ['Updated High Risk Transaction Policy'],
    }),
  }),
);

export type TUpdateRiskRulePolicy = Static<typeof UpdateRiskRulePolicySchema>;
