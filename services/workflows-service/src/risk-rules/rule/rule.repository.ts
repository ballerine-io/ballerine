import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class RuleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeService: ProjectScopeService,
  ) {}

  async create(
    createArgs: Omit<Prisma.RuleUncheckedCreateInput, 'riskRuleSetId' | 'projectId' | 'isPublic'>,
    projectId: string,
  ) {
    return this.prisma.rule.create({
      data: { ...createArgs, projectId, isPublic: false },
    });
  }

  async findManyByRuleset(
    riskRuleSetId: string,
    projectIds: TProjectIds,
    args?: Prisma.RuleFindManyArgs,
  ) {
    return this.prisma.rule.findMany(
      this.scopeService.scopeFindManyOrPublic(
        {
          ...args,
          where: { ...args?.where, riskRuleSetRules: { some: { riskRuleSetId: riskRuleSetId } } },
        },
        projectIds,
      ),
    );
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  async assignRuleToRuleset(ruleId: string, riskRuleSetId: string) {
    return this.prisma.riskRuleSetRule.create({
      data: {
        riskRuleSetId,
        ruleId,
      },
    });
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  async unassignRuleFromRuleset(ruleId: string, riskRuleSetId: string) {
    return this.prisma.riskRuleSetRule.delete({
      where: {
        riskRuleSetId_ruleId: {
          ruleId,
          riskRuleSetId,
        },
      },
    });
  }

  async findMany(projectIds: TProjectIds, args?: Prisma.RuleFindManyArgs) {
    return this.prisma.rule.findMany(
      this.scopeService.scopeFindManyOrPublic(
        {
          ...args,
          where: { ...args?.where },
        },
        projectIds,
      ),
    );
  }

  async findById(id: string, projectIds: TProjectIds, args?: Prisma.RuleFindFirstOrThrowArgs) {
    return this.prisma.rule.findFirstOrThrow(
      this.scopeService.scopeFindOneOrPublic(
        {
          ...(args ? args : {}),
          where: { ...(args?.where ? { ...args?.where } : {}), id: id },
        },
        projectIds,
      ),
    );
  }

  async updateById(
    id: string,
    projectId: string,
    dataArgs: Partial<Omit<Prisma.RuleUncheckedUpdateInput, 'projectId' | 'id' | 'isPublic'>>,
  ) {
    return this.prisma.rule.update({
      data: {
        ...dataArgs,
        projectId,
        isPublic: false,
      },
      where: {
        id: id,
      },
    });
  }

  async deleteById(id: string, projectIds: TProjectIds) {
    return this.prisma.riskRuleSet.delete(
      this.scopeService.scopeDelete(
        {
          where: {
            id: id,
          },
        },
        projectIds,
      ),
    );
  }
}
