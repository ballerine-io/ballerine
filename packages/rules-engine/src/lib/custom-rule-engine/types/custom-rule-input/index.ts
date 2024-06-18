import { CustomRulesTypes } from '@/lib/custom-rule-engine/consts/custom-rule-type';
import { CustomRuleOperations } from '@/lib/custom-rule-engine/consts/custom-rule-operations';
import { CustomRuleCastOptions } from '@/lib/custom-rule-engine/consts/custom-rule-cast-options';

export type CustomRuleInput = {
  type: (typeof CustomRulesTypes)[number];
  options: {
    fieldPath?: string;
    cast?: (typeof CustomRuleCastOptions)[number];
    operations?: (typeof CustomRuleOperations)[number];
    compareValue?: string;
  };
};
