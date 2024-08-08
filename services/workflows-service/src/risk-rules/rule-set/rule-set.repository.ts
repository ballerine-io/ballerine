import {Injectable} from '@nestjs/common';
import {PrismaService} from '@/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {ProjectScopeService} from '@/project/project-scope.service';
import {TProjectIds} from '@/types';
import {RULESET_DEPTH_OF_3_WITH_RULES} from "@/risk-rules/consts/rule-set-depth-of-3-with-rules";
import {
  RULESET_PARENT_DEPTH_3_WITH_POLICIES
} from "@/risk-rules/consts/rule-set-parent-depth-3-with-policies";


@Injectable()
export class RuleSetRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeService: ProjectScopeService,
  ) {}

  async create(
    {
      createArgs,
      projectId,
      riskRuleId,
      parentId
    }: {
      createArgs: Omit<Prisma.RuleSetUncheckedCreateInput, 'projectId'>,
      projectId: string,
      riskRuleId?: string,
      parentId?: string,
    }
  ) {
    return this.prisma.ruleSet.create({
      data: {
        ...createArgs,
        projectId,
        isPublic: false,
        ...(riskRuleId ? {
          riskRuleRuleSets: {
            create: {
              riskRuleId: riskRuleId,
            }
          },
        } : {}),
        ...(parentId ? {
          childRuleSets: {
            create: {
              parentId: parentId,
            }
          }
        } : {}),
      }
    });
  }

  async findManyByRiskRule(
    riskRuleId: string,
    projectIds: TProjectIds,
  ) {
    return this.prisma.ruleSet.findFirstOrThrow(
      this.scopeService.scopeFindOneOrPublic(
        {
          where: {
            riskRuleRuleSets: {
              some: {
                riskRuleId: riskRuleId,
              },
            },
          },
          include: RULESET_DEPTH_OF_3_WITH_RULES,
        },
        projectIds,
      ),
    );
  }

  async findById(
    id: string,
    projectIds: TProjectIds,
    args?: Prisma.RuleSetFindFirstOrThrowArgs,
  ) {
    return this.prisma.ruleSet.findFirstOrThrow(
      this.scopeService.scopeFindOneOrPublic(
        {
          ...(args ? args : {}),
          where: {
            ...(args?.where ? { ...args?.where } : {}), id: id,
          },
          include: RULESET_DEPTH_OF_3_WITH_RULES,
        },
        projectIds,
      ),
    );
  }

  async findMany(
    args: Prisma.RuleSetFindManyArgs,
    projectIds: TProjectIds,
  ) {
    return this.prisma.ruleSet.findMany(
      this.scopeService.scopeFindOneOrPublic(
        {
          ...(args ? args : {}),
          where: {
            ...(args?.where ? { ...args?.where } : {}),
          },
          include: RULESET_DEPTH_OF_3_WITH_RULES,
        },
        projectIds,
      ),
    );
  }


  async updateById(
    id: string,
    projectId: string,
    dataArgs: Omit<Prisma.RuleSetUncheckedUpdateInput, 'projectId'>,
  ) {
    return this.prisma.ruleSet.update({
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
  async connectToRuleset(
    childRulesetId: string,
    parentRuleSetId: string
  ) {
    return this.prisma.ruleSetToRuleSet.create({
      data: {
        parentId: parentRuleSetId,
        childId: childRulesetId
      },
    });
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  async disconnectFromRuleset(
    childRuleSetId: string,
    parentRuleSetId: string
  ) {
    return this.prisma.ruleSetToRuleSet.delete({
      where: {
        parentId_childId: {
          parentId: parentRuleSetId,
          childId: childRuleSetId,
        }
      }
    });
  }

  async deleteById(id: string, projectIds: TProjectIds) {
    return this.prisma.ruleSet.delete(
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

  async findAllAssociatedPolicies(childRulesetId: string, projectIds: TProjectIds) {
    return this.prisma.ruleSet.findFirst({
      where: {
        id: childRulesetId,
      },
      include: RULESET_PARENT_DEPTH_3_WITH_POLICIES,
    });
  }

  async findAssociatedRulesetsAndDefinitions(id: string, projectIds: TProjectIds) {
    return this.prisma.ruleSet.findFirst({
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
                    riskRule: true
                  },
                }
              }
            },
          },
          where: {
            ruleSet: {
              projectId: {
                in: projectIds,
              },
            },
          },
        }
      },
    });
  }
}
