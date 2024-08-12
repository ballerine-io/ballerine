import { Static, Type } from '@sinclair/typebox';

export const ConnectRiskRuleToRulesetSchema = Type.Object({
  ruleSetId: Type.String({
    description: 'The ID of the ruleset to connect the risk rule to',
  }),
});

export type TConnectRiskRuleToRuleset = Static<typeof ConnectRiskRuleToRulesetSchema>;
