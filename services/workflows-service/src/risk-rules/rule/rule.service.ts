import { BadRequestException, Injectable } from '@nestjs/common';
import { RuleRepository } from './rule.repository';
import { TProjectId, TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class RuleService {
  constructor(private readonly ruleRepository: RuleRepository) {}

  async findById(id: string, projectIds: TProjectIds) {
    return await this.ruleRepository.findById(id, projectIds);
  }

  async findManyByRuleset(rulesetId: string, projectIds: TProjectIds) {
    return this.ruleRepository.findMany(
      {
        where: {
          rulesetRules: {
            some: {
              ruleSetId: rulesetId,
            },
          },
        },
      },
      projectIds,
    );
  }

  async findMany(projectIds: TProjectIds, args?: Prisma.RuleFindManyArgs) {
    return await this.ruleRepository.findMany(args || {}, projectIds);
  }

  async assignRuleToRuleset(
    ruleId: string,
    rulesetId: string,
    projectId: TProjectId,
    projectIds: TProjectIds,
  ) {
    const {
      id,
      projectId: ruleProjectId,
      isPublic: ruleIsPublic,
      ...resetRule
    } = await this.ruleRepository.findById(ruleId, projectIds);

    if (ruleProjectId) {
      return await this.ruleRepository.connectToRuleset(id, rulesetId);
    }

    return await this.ruleRepository.create({
      createArgs: {
        ...resetRule,
        comparisonValue:
          resetRule.comparisonValue as Prisma.RuleUncheckedCreateInput['comparisonValue'],
      },
      projectId,
      ruleSetId: rulesetId,
    });
  }

  async unassignRuleFromRuleset(
    ruleId: string,
    rulesetId: string,
    projectId: TProjectId,
    projectIds: TProjectIds,
  ) {
    const { id } = await this.ruleRepository.findById(ruleId, projectIds);

    if (!projectId) {
      throw new BadRequestException('Cannot unassign rule from ruleset without project id');
    }

    return await this.ruleRepository.disconnectFromRuleset(id, rulesetId);
  }

  async createNewRule({
    ruleData,
    rulesetId,
    projectId,
  }: {
    ruleData: Omit<Prisma.RuleUncheckedCreateInput, 'projectId' | 'isPublic'>;
    rulesetId?: string;
    projectId: TProjectId;
  }) {
    const rule = await this.ruleRepository.create({
      createArgs: ruleData,
      ruleSetId: rulesetId,
      projectId,
    });

    return rule;
  }

  async updateRule({
    ruleId,
    ruleData,
    projectId,
    projectIds,
  }: {
    ruleId: string;
    ruleData: Partial<
      Omit<Prisma.RuleUncheckedCreateInput, 'riskRuleSetId' | 'projectId' | 'isPublic'>
    >;
    projectId: TProjectId;
    projectIds: TProjectIds;
  }) {
    const rule = await this.findById(ruleId, projectIds);

    if (rule.isPublic) {
      throw new BadRequestException('Cannot delete public rule');
    }

    return await this.ruleRepository.updateById(ruleId, projectId, ruleData);
  }

  async deleteRule({ ruleId, projectIds }: { ruleId: string; projectIds: TProjectIds }) {
    const rule = await this.findById(ruleId, projectIds);

    if (rule.isPublic) {
      throw new BadRequestException('Cannot delete public rule');
    }

    return await this.ruleRepository.deleteById(ruleId, projectIds);
  }
}
