import { Static, Type } from '@sinclair/typebox';
import { TypeStringEnum } from '@/helpers/type-box/type-string-enum';
import { OPERATION } from '@ballerine/common';

export const UpdateRuleSchema = Type.Object({
  name: Type.Optional(
    Type.String({
      description: 'Name of the rule',
      examples: ['Transaction Amount Check'],
    }),
  ),
  key: Type.Optional(
    Type.String({
      description: 'The unique key of the parameter  for the rule',
      examples: ['entity.transaction.amount'],
    }),
  ),
  operation: Type.Optional(
    TypeStringEnum(Object.values(OPERATION), 'The operation to perform', [OPERATION.GT]),
  ),
  comparisonValue: Type.Optional(
    Type.Any({
      description: 'The value to compare against using the operation',
      examples: [100],
    }),
  ),
  engine: Type.Optional(
    TypeStringEnum(['Ballerine', 'JsonLogic'], 'The rule engine to use', ['1000']),
  ),
});

export type TUpdateRule = Static<typeof UpdateRuleSchema>;
