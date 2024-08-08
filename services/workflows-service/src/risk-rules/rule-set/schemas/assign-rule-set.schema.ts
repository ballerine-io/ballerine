import { Static, Type } from '@sinclair/typebox';

export const AssignRuleSetToParentRuleSet = Type.Object({
  parentRuleSetId: Type.String({
    description: 'The risk rule set id to assign the rule to',
  }),
});

export type TassignToParentRuleSet = Static<typeof AssignRuleSetToParentRuleSet>;
