import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectIds } from '@/types';

@Injectable()
export class RiskRuleSetRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeService: ProjectScopeService,
  ) {}

  async create(
    riskRulePolicyId: string,
    createArgs: Omit<Prisma.RiskRuleSetUncheckedCreateInput, 'riskRulePolicyId' | 'projectId'>,
    projectId: string,
  ) {
    return this.prisma.riskRuleSet.create({
      data: { ...createArgs, riskRulePolicyId, projectId, isPublic: false },
    });
  }

  async findMany(
    riskRulePolicyId: string,
    args: Prisma.RiskRuleSetFindManyArgs,
    projectIds: TProjectIds,
  ) {
    return this.prisma.riskRuleSet.findMany(
      this.scopeService.scopeFindManyOrPublic(
        {
          ...args,
          where: { ...args?.where, riskRulePolicyId },
        },
        projectIds,
      ),
    );
  }

  async findById(
    id: string,
    projectIds: TProjectIds,
    args?: Prisma.RiskRuleSetFindFirstOrThrowArgs,
  ) {
    return this.prisma.riskRuleSet.findFirstOrThrow(
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
    riskRulePolicyId: string,
    projectId: string,
    dataArgs: Omit<Prisma.RiskRuleSetUncheckedUpdateInput, 'projectId' | 'riskRulePolicyId'>,
  ) {
    return this.prisma.riskRuleSet.update({
      data: {
        ...dataArgs,
        riskRulePolicyId,
        projectId,
        isPublic: false,
      },
      where: {
        id_riskRulePolicyId: {
          id: id,
          riskRulePolicyId: riskRulePolicyId,
        },
      },
    });
  }

  async deleteById(id: string, riskRulePolicyId: string, projectIds: TProjectIds) {
    return this.prisma.riskRuleSet.delete(
      this.scopeService.scopeDelete(
        {
          where: {
            id_riskRulePolicyId: {
              id: id,
              riskRulePolicyId: riskRulePolicyId,
            },
          },
        },
        projectIds,
      ),
    );
  }
}
