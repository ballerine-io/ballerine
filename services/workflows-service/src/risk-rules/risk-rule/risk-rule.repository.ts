import {Injectable} from '@nestjs/common';
import {PrismaService} from '@/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {ProjectScopeService} from '@/project/project-scope.service';
import {TProjectIds} from '@/types';

@Injectable()
export class RuleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeService: ProjectScopeService,
  ) {}

  async create(
    {
      createArgs,
      projectId,
      ruleSetId,
    }: {
      createArgs: Omit<Prisma.RiskRuleUncheckedCreateInput, 'projectId'>,
      projectId: string,
      ruleSetId?: string,
    }
  ) {
    return this.prisma.riskRule.create({
      data: {
        ...createArgs,
        projectId,
        isPublic: false,
        ...(ruleSetId ? {
          riskRuleRuleSets: {
            create: {
              ruleSetId: ruleSetId,
            }
          },
        } : {}),
      }
    });
  }

  async findMany(
    {
      args,
      policyId,
    }: {
      args: Prisma.RiskRuleFindManyArgs,
      policyId?: string
    },
    projectIds: TProjectIds,
  ) {
    return this.prisma.riskRule.findMany(
      this.scopeService.scopeFindManyOrPublic(
        {
          ...args,
          where: {
            ...args?.where,
          ...(policyId ? {
            policyId: policyId
          } : {})
          },
        },
        projectIds,
      ),
    );
  }

  async findById(
    id: string,
    projectIds: TProjectIds,
    args?: Prisma.RuleFindFirstOrThrowArgs,
  ) {
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
  async connectToRuleset(
    id: string,
    ruleSetId: string
  ) {
    return this.prisma.ruleSetRule.upsert({
      create: {
        ruleSetId,
        ruleId: id
      },
      update: {
        ruleSetId,
      },
      where: {
        ruleId_ruleSetId: {
          ruleId: id,
          ruleSetId: ruleSetId,
        }
      }
    });
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
  async disconnectFromRuleset(
    id: string,
    ruleSetId: string
  ) {
    return this.prisma.ruleSetRule.delete({
      where: {
        ruleId_ruleSetId: {
          ruleId: id,
          ruleSetId: ruleSetId,
        }
      }
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
}
