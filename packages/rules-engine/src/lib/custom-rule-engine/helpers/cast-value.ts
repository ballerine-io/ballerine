import { CustomRuleInput } from '@/lib/custom-rule-engine/types/custom-rule-input';

export const castValue = (options: CustomRuleInput['options'], value: string) => {
  switch (options.cast) {
    case 'String':
      return String(value);
    case 'Number':
      return Number(value);
    case 'Boolean':
      return Boolean(value);
    case 'Date':
      return new Date(value);
    default:
      return value;
  }
};
