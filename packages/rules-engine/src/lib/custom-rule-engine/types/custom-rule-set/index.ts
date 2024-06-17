import { CustomRuleInput } from '../custom-rule-input';

export type CustomRuleSet = {
  operator: 'and' | 'or';
  rules: CustomRuleInput[];
};
