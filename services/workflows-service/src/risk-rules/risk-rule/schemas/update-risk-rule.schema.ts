import { Static, Type } from '@sinclair/typebox';
import { CreateRiskRuleSchema } from '@/risk-rules/risk-rule/schemas/create-risk-rule.schema';

export const UpdateRiskRuleSchema = Type.Partial(CreateRiskRuleSchema);

export type TUpdateRiskRule = Static<typeof UpdateRiskRuleSchema>;
