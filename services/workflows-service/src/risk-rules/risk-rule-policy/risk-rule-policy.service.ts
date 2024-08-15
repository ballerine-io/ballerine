import { Injectable } from '@nestjs/common';
import { RiskRulePolicyRepository } from './risk-rule-policy.repository';
import { TProjectId, TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';
import { RuleSetWithChildrenAndRules } from '@/risk-rules/types/types';
import { Rule, RuleSchema, RuleSetWithChildren, Serializable } from '@ballerine/common';

@Injectable()
export class RiskRulePolicyService {
  constructor(private readonly riskRulePolicyRepository: RiskRulePolicyRepository) {}

  async createRiskRulePolicy(data: Prisma.RiskRulesPolicyUncheckedCreateInput) {
    return this.riskRulePolicyRepository.create(data);
  }

  async findById(id: string, projectIds: TProjectIds) {
    const policy = await this.riskRulePolicyRepository.findById(id, projectIds);

    return policy;
  }

  private extractRulesFromRuleSet(rulesSet: RuleSetWithChildrenAndRules) {
    const rules = rulesSet.rulesetRules.map(rulesetRule => {
      const { key, value, operation, comparisonValue, engine } = rulesetRule.rule;

      const parseResult = RuleSchema.parse({
        key,
        value,
        operator: operation,
      });

      return {
        ...parseResult,
        comparisonValue: comparisonValue as NonNullable<Serializable>,
        engine,
      } satisfies Rule & {
        comparisonValue: NonNullable<Serializable>;
        engine: string;
      };
    }) satisfies Rule[];

    return {
      rules,
      operator: rulesSet.operator,
      childRuleSet: rulesSet.childRuleSets.map(childRuleSet =>
        this.extractRulesFromRuleSet(childRuleSet.child),
      ),
    };
  }

  async formatRiskRuleWithRules(id: string, projectIds: TProjectIds) {
    const policyWithRiskRules = await this.findById(id, projectIds);

    return policyWithRiskRules.riskRules.map(riskRule => {
      const ruleSet = riskRule.riskRuleRuleSets.map(riskRuleRuleSet => {
        const ruleSet = this.extractRulesFromRuleSet(riskRuleRuleSet.ruleSet);

        return ruleSet;
      }) as RuleSetWithChildren[];

      return {
        operator: riskRule.operator,
        domain: riskRule.domain,
        indicator: riskRule.indicator,
        baseRiskScore: riskRule.baseRiskScore,
        additionalRiskScore: riskRule.additionalRiskScore,
        minRiskScore: riskRule.minRiskScore,
        maxRiskScore: riskRule.maxRiskScore,
        ruleSet,
      };
    });
  }

  async findMany(args: Prisma.RiskRulesPolicyFindManyArgs, projectIds: TProjectIds) {
    return this.riskRulePolicyRepository.findMany(args, projectIds);
  }

  async updateRiskRulePolicy(
    id: string,
    data: Prisma.RiskRulesPolicyUncheckedUpdateInput,
    projectId: TProjectId,
  ) {
    return this.riskRulePolicyRepository.update(
      id,
      {
        ...data,
        projectId,
        isPublic: false,
      },
      projectId,
    );
  }

  async deleteRiskRulePolicy(id: string, projectIds: TProjectIds) {
    return this.riskRulePolicyRepository.delete(id, projectIds);
  }

  async addRiskRuleToPolicy(policyId: string, riskRuleId: string, projectIds: TProjectIds) {
    return await this.riskRulePolicyRepository.addRiskRule(policyId, riskRuleId, projectIds);
  }
}
