import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectIds } from '@/types';

@Injectable()
export class RuleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeService: ProjectScopeService,
  ) {}

  async create({
    createArgs,
    projectId,
    ruleSetId,
  }: {
    createArgs: Omit<Prisma.RuleUncheckedCreateInput, 'projectId'>;
    projectId: string;
    ruleSetId?: string;
  }) {
    return this.prisma.rule.create({
      data: {
        ...createArgs,
        projectId,
        isPublic: false,
        ...(ruleSetId
          ? {
              rulesetRules: {
                create: {
                  ruleSetId: ruleSetId,
                },
              },
            }
          : {}),
      },
    });
  }

  async findMany(args: Prisma.RuleFindManyArgs, projectIds: TProjectIds) {
    return this.prisma.rule.findMany(
      this.scopeService.scopeFindManyOrPublic(
        {
          ...args,
          where: { ...args.where },
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
    dataArgs: Omit<Prisma.RuleUncheckedUpdateInput, 'projectId' | 'riskRulePolicyId'>,
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

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  async connectToRuleset(id: string, ruleSetId: string) {
    return this.prisma.ruleSetRule.upsert({
      create: {
        ruleSetId,
        ruleId: id,
      },
      update: {
        ruleSetId,
      },
      where: {
        ruleId_ruleSetId: {
          ruleId: id,
          ruleSetId: ruleSetId,
        },
      },
    });
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  async disconnectFromRuleset(id: string, ruleSetId: string) {
    return this.prisma.ruleSetRule.delete({
      where: {
        ruleId_ruleSetId: {
          ruleId: id,
          ruleSetId: ruleSetId,
        },
      },
    });
  }

  async deleteById(id: string, projectIds: TProjectIds) {
    return this.prisma.rule.delete(
      this.scopeService.scopeDelete(
        {
          where: {
            id,
          },
        },
        projectIds,
      ),
    );
  }

  async findAssociatedRulesetsAndDefinitions(id: string, projectIds: TProjectIds) {
    // TODO query result for each definition uses this policies
    return this.prisma.rule.findFirst({
      where: {
        id,
      },
      include: {
        rulesetRules: {
          include: {
            ruleSet: {
              include: {
                riskRuleRuleSets: {
                  include: {
                    riskRule: true,
                  },
                },
              },
            },
          },
          where: {
            ruleSet: {
              projectId: {
                in: projectIds,
              },
            },
          },
        },
      },
    });
  }
}
