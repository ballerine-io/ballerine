import { Static, Type } from '@sinclair/typebox';

export const AssignRuleSchema = Type.Object({
  ruleSetId: Type.String({
    description: 'The risk rule set id to assign the rule to',
  }),
});

export type TAssignRule = Static<typeof AssignRuleSchema>;
