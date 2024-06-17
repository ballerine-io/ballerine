import { TRuleEngine } from '@/lib/types';
import { CustomRuleEngine } from '@/lib/custom-rule-engine';
import { JMESPathRuleEngine } from '@/lib/jmespath-rule-engine';

export const createRuleEngine: TRuleEngine = ruleWithProvider => {
  switch (ruleWithProvider.provider) {
    case 'custom':
      return CustomRuleEngine(ruleWithProvider);
    case 'jmespath':
      return JMESPathRuleEngine(ruleWithProvider);
    default:
      throw new Error('Invalid provider');
  }
};
