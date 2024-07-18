import { Static, Type } from '@sinclair/typebox';

export const AssignRuleSchema = Type.Object({
  riskRuleSetId: Type.String({
    description: 'The risk rule set id to assign the rule to',
  }),
});

export type TAssignRule = Static<typeof AssignRuleSchema>;
