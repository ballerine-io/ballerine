import { uniq } from 'lodash';
import { RuleSetWithParent } from '@/risk-rules/types/types';

export const extractRiskRulePolicy = (ruleSet: RuleSetWithParent) => {
  const traverse = (currentRuleSet: RuleSetWithParent, riskRulesPoliciesId: string[]) => {
    if (currentRuleSet?.riskRuleRuleSets.length > 0) {
      riskRulesPoliciesId = uniq([
        ...riskRulesPoliciesId,
        ...currentRuleSet.riskRuleRuleSets.flatMap(({ riskRule }) => riskRule.riskRulePolicyId),
      ]);
    }

    if (currentRuleSet.parentRuleSets?.length === 0) {
      currentRuleSet.parentRuleSets.flatMap(parentRuleSet => {
        if (parentRuleSet.parent) {
          return traverse(parentRuleSet.parent as RuleSetWithParent, riskRulesPoliciesId);
        }
      });
    }

    return riskRulesPoliciesId;
  };

  return traverse(ruleSet, []);
};
