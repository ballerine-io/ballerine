import { BadRequestException, Injectable } from '@nestjs/common';
import { TProjectId, TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';
import { RuleSetRepository } from '@/risk-rules/rule-set/rule-set.repository';
import { extractRiskRulePolicy } from '@/risk-rules/helpers/rule-set-search-and-flatten-values';
import { RuleSetWithParent } from '../types/types';

@Injectable()
export class RuleSetService {
  constructor(private readonly ruleSetRepository: RuleSetRepository) {}

  async findById(id: string, projectIds: TProjectIds) {
    return await this.ruleSetRepository.findById(id, projectIds);
  }

  async findManyByRuleset(rulesetId: string, projectIds: TProjectIds) {
    return await this.ruleSetRepository.findMany(
      {
        where: {
          id: rulesetId,
        },
      },
      projectIds,
    );
  }

  async findMany(projectIds: TProjectIds, args?: Prisma.RuleSetFindManyArgs) {
    return await this.ruleSetRepository.findMany(args || {}, projectIds);
  }

  async findAssociatedRiskPolcies(rulesetId: string, projectIds: TProjectIds) {
    const ruleSetWithParents = (await this.ruleSetRepository.findAllAssociatedPolicies(
      rulesetId,
      projectIds,
    )) as RuleSetWithParent;
    const riskRulePolicy = extractRiskRulePolicy(ruleSetWithParents);

    return riskRulePolicy;
  }

  async assignRuleSetToParentRuleset(childRulesetId: string, parentRulesetId: string) {
    return await this.ruleSetRepository.connectToRuleset(childRulesetId, parentRulesetId);
  }

  async unassignRuleFromRuleset(ruleSetId: string, parentRuleSetId: string) {
    return await this.ruleSetRepository.disconnectFromRuleset(ruleSetId, parentRuleSetId);
  }

  async createRuleSet({
    ruleSetData,
    parentRuleSetId,
    projectId,
  }: {
    ruleSetData: Omit<Prisma.RuleSetUncheckedCreateInput, 'projectId' | 'isPublic'>;
    parentRuleSetId?: string;
    projectId: TProjectId;
  }) {
    const ruleSet = await this.ruleSetRepository.create({
      createArgs: ruleSetData,
      parentId: parentRuleSetId,
      projectId,
    });

    return ruleSet;
  }

  async updateRuleSet({
    ruleId,
    ruleData,
    projectId,
    projectIds,
  }: {
    ruleId: string;
    ruleData: Partial<Omit<Prisma.RuleSetUncheckedCreateInput, 'projectId' | 'isPublic' | 'id'>>;
    projectId: TProjectId;
    projectIds: TProjectIds;
  }) {
    const rule = await this.findById(ruleId, projectIds);

    if (rule.isPublic) {
      throw new BadRequestException('Cannot delete public rule');
    }

    return await this.ruleSetRepository.updateById(ruleId, projectId, ruleData);
  }

  async deleteRule({ ruleId, projectIds }: { ruleId: string; projectIds: TProjectIds }) {
    const rule = await this.findById(ruleId, projectIds);

    if (rule.isPublic) {
      throw new BadRequestException('Cannot delete public rule');
    }

    return await this.ruleSetRepository.deleteById(ruleId, projectIds);
  }
}
