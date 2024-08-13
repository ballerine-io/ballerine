import { Injectable, NotFoundException } from '@nestjs/common';
import { RiskRuleRepository } from './risk-rule.repository';
import { TProjectId, TProjectIds } from '@/types';
import { Prisma, RiskRule } from '@prisma/client';

@Injectable()
export class RiskRuleService {
  constructor(private readonly riskRuleRepository: RiskRuleRepository) {}

  async createNewRiskRule({
    riskRuleData,
    projectId,
    ruleSetId,
  }: {
    riskRuleData: Omit<Prisma.RiskRuleUncheckedCreateInput, 'projectId' | 'isPublic'>;
    projectId: TProjectId;
    ruleSetId?: string;
  }): Promise<RiskRule> {
    const riskRule = await this.riskRuleRepository.create({
      createArgs: riskRuleData,
      projectId,
    });

    if (ruleSetId) {
      await this.connectRiskRuleToRuleset(riskRule.id, ruleSetId);
    }

    return riskRule;
  }

  async findById(id: string, projectIds: TProjectIds) {
    const riskRule = await this.riskRuleRepository.findById(id, projectIds);

    return riskRule;
  }

  async findMany(args: Prisma.RiskRuleFindManyArgs, projectIds: TProjectIds) {
    return this.riskRuleRepository.findMany(args, projectIds);
  }

  async updateRiskRule({
    id,
    updateData,
    projectId,
  }: {
    id: string;
    updateData: Prisma.RiskRuleUpdateInput;
    projectId: TProjectId;
  }) {
    return this.riskRuleRepository.update(
      id,
      {
        ...updateData,
        isPublic: false,
      },
      projectId,
    );
  }

  async deleteRiskRule(id: string, projectIds: TProjectIds): Promise<RiskRule> {
    return this.riskRuleRepository.delete(id, projectIds);
  }

  async createCopyOfRiskRule({
    originalId,
    newName,
    projectId,
    projectIds,
  }: {
    originalId: string;
    newName: string;
    projectId: TProjectId;
    projectIds: TProjectIds;
  }) {
    return this.riskRuleRepository.createCopy(originalId, newName, projectId, projectIds);
  }

  async connectRiskRuleToRuleset(riskRuleId: string, ruleSetId: string) {
    await this.riskRuleRepository.connectToRuleset(riskRuleId, ruleSetId);
  }

  async disconnectRiskRuleFromRuleset(riskRuleId: string, ruleSetId: string) {
    await this.riskRuleRepository.disconnectFromRuleset(riskRuleId, ruleSetId);
  }
}
