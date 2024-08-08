import {RiskRuleRuleSet, RuleSet, RiskRulesPolicy, RiskRule} from "@prisma/client";
import {uniq} from "lodash";

type RiskRuleWithPolicy = RiskRule & {
  riskRulePolicy: RiskRulesPolicy | null
}

type RiskRuleRuleSetWithRule = RiskRuleRuleSet & {
  riskRule: RiskRuleWithPolicy
}

type RuleSetWithRiskRules = RuleSet & {
  riskRuleRuleSets: RiskRuleRuleSetWithRule[]
}

export type RuleSetWithParent = RuleSetWithRiskRules & {
  parentRuleSets: Array<{
    parent: RuleSetWithRiskRules & {
      parentRuleSets: Array<{
        parent: RuleSetWithRiskRules & {
          parentRuleSets: Array<{
            parent: RuleSetWithRiskRules
          }>
        }
      }>
    }
  }>
}

export const extractRiskRulePolicy = (ruleSet: RuleSetWithParent) => {
  const traverse = (currentRuleSet: RuleSetWithParent, riskRulesPoliciesId: string[]) => {

    if (currentRuleSet?.riskRuleRuleSets.length > 0) {
      riskRulesPoliciesId = uniq([...riskRulesPoliciesId, ...(currentRuleSet.riskRuleRuleSets.flatMap(({ riskRule }) => riskRule.riskRulePolicyId))]);
    }

    if (currentRuleSet.parentRuleSets?.length === 0) {
      currentRuleSet.parentRuleSets.flatMap((parentRuleSet) => {
        if (parentRuleSet.parent) {
          return traverse(parentRuleSet.parent as RuleSetWithParent, riskRulesPoliciesId);
        }
      });
    }

    return riskRulesPoliciesId;
  };

  return traverse(ruleSet, [])
}
