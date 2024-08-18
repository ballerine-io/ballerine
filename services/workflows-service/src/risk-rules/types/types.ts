import {
  RiskRule,
  RiskRuleRuleSet,
  RiskRulesPolicy,
  Rule,
  RuleSet,
  RuleSetRule,
  RuleSetToRuleSet,
} from '@prisma/client';

type RiskRuleWithPolicy = RiskRule & {
  riskRulePolicy: RiskRulesPolicy | null;
};

type RiskRuleRuleSetWithRule = RiskRuleRuleSet & {
  riskRule: RiskRuleWithPolicy;
};

type RuleSetWithRiskRules = RuleSet & {
  riskRuleRuleSets: RiskRuleRuleSetWithRule[];
};

export type RiskRuleWithRuleSet = RiskRule & {
  riskRuleRuleSets: RiskRuleRuleSet[];
};

export type RuleSetWithChildrenAndRules = RuleSet & {
  childRuleSets: RulesetToRuleWithChild[];
  rulesetRules: RuleSetRuleWithRule[];
};

export type RulesetToRuleWithChild = RuleSetToRuleSet & {
  child: RuleSetWithChildrenAndRules;
};

export type RuleSetRuleWithRule = RuleSetRule & {
  rule: Rule;
};

export type RuleSetWithParent = RuleSetWithRiskRules & {
  parentRuleSets: Array<{
    parent: RuleSetWithRiskRules & {
      parentRuleSets: Array<{
        parent: RuleSetWithRiskRules & {
          parentRuleSets: Array<{
            parent: RuleSetWithRiskRules;
          }>;
        };
      }>;
    };
  }>;
};
