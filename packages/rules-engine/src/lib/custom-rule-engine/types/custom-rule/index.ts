import { CustomRuleInput } from '@/lib/custom-rule-engine/types/custom-rule-input';
import { DefaultContextPaths } from '@/lib/custom-rule-engine/consts/default-context-paths';

export interface CustomRule {
  (inputArguments: {
    rule: CustomRuleInput;
    context: Record<string, any>;
    fieldPath?: (typeof DefaultContextPaths)[keyof typeof DefaultContextPaths] & string;
  }): boolean;
}
