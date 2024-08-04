import { Static, Type } from '@sinclair/typebox';

export const UnassignRuleSchema = Type.Object({
  riskRuleSetId: Type.String({
    description: 'The risk rule set id to unassign from',
  }),
});

export type TUnassignRule = Static<typeof UnassignRuleSchema>;
