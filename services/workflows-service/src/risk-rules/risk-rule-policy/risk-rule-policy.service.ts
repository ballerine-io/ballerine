import { Injectable } from '@nestjs/common';
import { RiskRulePolicyRepository } from './risk-rule-policy.repository';
import { TProjectId, TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';
import { RuleSet } from "@ballerine/common";

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

  private mapRiskRule(riskRule: any) {
    const mappedRuleSets = riskRule.riskRuleRuleSets.map((riskRuleSet: ) =>
      this.mapRuleSet(rrs.ruleSet)
    );

    return {
      id: riskRule.id,
      ruleSet: mappedRuleSets,
      domain: riskRule.domain,
      indicator: riskRule.indicator,
      riskLevel: riskRule.riskLevel,
      baseRiskScore: riskRule.baseRiskScore,
      additionalRiskScore: riskRule.additionalRiskScore,
      minRiskScore: riskRule.minRiskScore,
      maxRiskScore: riskRule.maxRiskScore,
    };
  }

  async findAndConvertToActionable(id: string, projectIds: TProjectIds) {
    const policyWithRiskRules = await this.findById(id, projectIds);
    policyWithRiskRules.riskRules.map((riskRule) => {
      riskRule.riskRuleRuleSets
    })
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
