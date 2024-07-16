import { Type } from '@sinclair/typebox';
import { TypeStringEnum } from '@/helpers/type-box/type-string-enum';
import { OPERATION } from '@ballerine/common';

export const CreateRuleSchema = Type.Object({
  key: Type.String({
    description: 'The unique key of the parameter  for the rule',
  }),
  operation: TypeStringEnum(Object.values(OPERATION), 'The operation to perform'),
  value: Type.Any({
    description: 'The value to compare against',
  }),
  engine: TypeStringEnum(['Ballerine', 'JsonLogic']),
});
