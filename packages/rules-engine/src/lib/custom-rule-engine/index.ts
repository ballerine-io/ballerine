import { CustomRuleSet } from '@/lib/custom-rule-engine/types/custom-rule-set';
import { uboHasWarning } from '@/lib/custom-rule-engine/operations/ubo-has-warning';
import { CustomRuleInput } from '@/lib/custom-rule-engine/types/custom-rule-input';
import { evaluate } from './operations/evaluate';

export const CustomRuleEngine = ({
  context,
  ruleset,
}: {
  context: Record<string, unknown>;
  ruleset: CustomRuleSet;
}) => {
  const operationMethod = ruleset.operator === 'or' ? 'some' : 'every';

  return ruleset.rules
    .map(rule => {
      return invokeRule(rule, context);
    })
    [operationMethod](Boolean);
};

const invokeRule = (rule: CustomRuleInput, context: Record<string, unknown>) => {
  switch (rule.type) {
    case 'evaluate':
      return evaluate({ rule, context });
    case 'uboHasWarning':
      return uboHasWarning({ rule, context, ...rule.options });
  }
};
