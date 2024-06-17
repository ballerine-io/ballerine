import { CustomRuleInput } from '@/lib/custom-rule-engine/types/custom-rule-input';
import { castValue } from '@/lib/custom-rule-engine/helpers/cast-value';

export const castCompareWithEval = (options: CustomRuleInput['options'], value: string) => {
  if (value.startsWith('`') && value.endsWith('`')) {
    return castValue(options, eval(value));
  }

  return castValue(options, value);
};
