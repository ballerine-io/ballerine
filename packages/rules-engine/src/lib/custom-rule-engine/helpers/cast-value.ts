import { CustomRuleInput } from '@/lib/custom-rule-engine/types/custom-rule-input';

export const castValue = (options: CustomRuleInput['options'], value: string) => {
  if (value === 'undefined') {
    throw new Error(`Invalid value: ${value}`);
  }

  switch (options.cast) {
    case 'String':
      return String(value);
    case 'Number':
      return Number(value);
    case 'Boolean':
      return Boolean(value);
    case 'Date':
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date value: ${value}`);
      }

      return date;
    default:
      return value;
  }
};
