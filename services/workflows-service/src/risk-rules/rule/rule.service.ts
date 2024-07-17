import {BadRequestException, Injectable} from '@nestjs/common';
import { RuleRepository } from './rule.repository';
import {TProjectId, TProjectIds} from "@/types";
import {Prisma} from "@prisma/client";

@Injectable()
export class RuleService {
  constructor(
    private readonly ruleRepository: RuleRepository
  ) {}

  async findById(id: string, projectIds: TProjectIds) {
    return await this.ruleRepository.findById(id, projectIds)
  }

  async findManyByRuleset(
    riskRuleSetId: string,
    projectIds: TProjectIds
  ) {
    return await this.ruleRepository.findManyByRuleset(riskRuleSetId, projectIds)
  }

  async findMany(
    projectIds: TProjectIds,
    args?: Prisma.RuleFindManyArgs,
  ) {
    return await this.ruleRepository.findMany(projectIds, args)
  }

  async assignRuleToRuleset(ruleId: string, riskRuleSetId: string, projectId: TProjectId, projectIds: TProjectIds) {
    const {
      id,
      projectId: ruleProjectId,
      isPublic: ruleIsPublic,
      ...resetRule
    } = await this.ruleRepository.findById(ruleId, projectIds);

    if (projectId) {
      return await this.ruleRepository.assignRuleToRuleset(
        id,
        riskRuleSetId
      );
    }

    return await this.ruleRepository.create({
      ...resetRule,
      comparisonValue: resetRule.comparisonValue as Prisma.RuleUncheckedCreateInput['comparisonValue'],
      riskRuleSets: {
        connect: {
          id: riskRuleSetId
        }
      }
    }, projectId);
  }

  async createNewRule(
    {
      ruleData,
      riskRuleSetId,
      projectId
    }: {
      ruleData: Omit<Prisma.RuleUncheckedCreateInput, 'riskRuleSetId' | 'projectId' | 'isPublic'>,
      riskRuleSetId?: string,
      projectId: TProjectId
    }) {
    const rule = await this.ruleRepository.create({
      ...ruleData,
      ...(riskRuleSetId ? {
        riskRuleSets: {
          connect: {
            id: riskRuleSetId
          }
        }
      } : {}),
    }, projectId);

    return rule
  }

  async updateRule(
    {
      ruleId,
      ruleData,
      projectId,
    }: {
    ruleId: string,
    ruleData: Omit<Prisma.RuleUncheckedCreateInput, 'riskRuleSetId' | 'projectId' | 'isPublic'>,
    projectId: TProjectId,
  }) {
    const rule = await this.ruleRepository.updateById(ruleId, projectId, ruleData)

    return rule
  }

  async deleteRule(
    {
      ruleId,
      projectIds,
    }: {
      ruleId: string,
      projectIds: TProjectIds,
    }) {
    const rule = await this.findById(ruleId, projectIds);

    if (rule.isPublic) {
      throw new BadRequestException('Cannot delete public rule');
    }

    return await this.ruleRepository.deleteById(ruleId, projectIds)
  }


}
