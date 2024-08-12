import { Static, Type } from '@sinclair/typebox';

export const UnassignRuleFromRuleSetSchema = Type.Object({
  ruleSetId: Type.String({
    description: 'The risk rule set id to unassign from',
  }),
});

export type TUnassignRule = Static<typeof UnassignRuleFromRuleSetSchema>;
