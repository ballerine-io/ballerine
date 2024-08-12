import { Static, Type } from '@sinclair/typebox';

export const DisconnectRiskRuleToRulesetSchema = Type.Object({
  ruleSetId: Type.String({
    description: 'The ID of the ruleset to disconnect the from the risk rule',
  }),
});

export type TDisconnectRiskRuleToRuleset = Static<typeof DisconnectRiskRuleToRulesetSchema>;
