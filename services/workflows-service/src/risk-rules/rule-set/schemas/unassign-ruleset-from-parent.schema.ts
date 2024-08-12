import { Static, Type } from '@sinclair/typebox';

export const UnassignRulesetFromParentSchema = Type.Object({
  parentRuleSetId: Type.String({
    description: 'The risk rule set id to unassign from',
  }),
});

export type TUnassignRulesetFromSchema = Static<typeof UnassignRulesetFromParentSchema>;
