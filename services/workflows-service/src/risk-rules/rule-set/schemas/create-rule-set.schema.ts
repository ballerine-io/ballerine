import { Static, Type } from '@sinclair/typebox';
import { RulesetOperator } from '@prisma/client';

export const CreateRulesetSchema = Type.Object({
  name: Type.String(),
  operator: Type.Enum(RulesetOperator),
  parentRuleSetId: Type.Optional(Type.String()),
});
export type TCreatedRuleset = Static<typeof CreateRulesetSchema>;
