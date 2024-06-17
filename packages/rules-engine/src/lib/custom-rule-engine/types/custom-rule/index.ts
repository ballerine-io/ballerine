import { CustomRuleInput } from '@/lib/custom-rule-engine/types/custom-rule-input';
import { DefaultContextPath } from '@/lib/custom-rule-engine/consts/default-context-paths';

export interface CustomRule {
  (inputArguments: {
    rule: CustomRuleInput;
    context: Record<string, any>;
    fieldPath?: (typeof DefaultContextPath)[keyof typeof DefaultContextPath] & string;
  }): boolean;
}
