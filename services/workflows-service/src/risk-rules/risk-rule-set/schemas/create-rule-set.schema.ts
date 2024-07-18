import { Type } from '@sinclair/typebox';
import { TypeStringEnum } from '@/helpers/type-box/type-string-enum';
import { OPERATOR } from '@ballerine/common';
import { CreateRuleSchema } from '@/risk-rules/rule/schemas/create-rule.schema';

export const CreateRuleSetSchema = Type.Object(
  {
    operator: TypeStringEnum(
      Object.values(OPERATOR),
      'The operator to apply to aggregate the rules',
    ),
    rules: Type.Array(CreateRuleSchema),
  },
  { description: 'The rule set to apply for the rule' },
);
