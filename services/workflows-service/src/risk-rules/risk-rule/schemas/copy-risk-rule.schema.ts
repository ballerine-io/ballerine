import { Static, Type } from '@sinclair/typebox';

export const CopyRiskRuleSchema = Type.Object({
  newName: Type.String({
    description: 'The name for the new copy of the risk rule',
    examples: ['Copy of High Transaction Amount Risk'],
  }),
});

export type TCopyRiskRule = Static<typeof CopyRiskRuleSchema>;
