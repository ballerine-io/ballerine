import { Static, Type } from '@sinclair/typebox';
import { TypeStringEnum } from '@/helpers/type-box/type-string-enum';
import { OPERATION } from '@ballerine/common';

export const CreateRuleSchema = Type.Object({
  name: Type.String({
    description: 'Name of the rule',
    examples: ['Transaction Amount Check'],
  }),
  key: Type.String({
    description: 'The unique key of the parameter  for the rule',
    examples: ['entity.transaction.amount'],
  }),
  operation: TypeStringEnum(Object.values(OPERATION), 'The operation to perform', [OPERATION.GT]),
  comparisonValue: Type.Any({
    description: 'The value to compare against using the operation',
    examples: [100],
  }),
  engine: TypeStringEnum(['Ballerine', 'JsonLogic'], 'The rule engine to use', ['1000']),
  riskRuleSetId: Type.Optional(
    Type.String({
      description: 'The risk rule set id to assign the rule to',
    }),
  ),
});

export type TCreateRule = Static<typeof CreateRuleSchema>;
