import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, RiskRulesPolicy } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId, TProjectIds } from '@/types';

@Injectable()
export class RiskRulePolicyRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeService: ProjectScopeService,
  ) {}

  async create(data: Prisma.RiskRulesPolicyUncheckedCreateInput) {
    return this.prisma.riskRulesPolicy.create({ data });
  }

  async findById(id: string, projectIds: TProjectIds) {
    return this.prisma.riskRulesPolicy.findFirstOrThrow(
      this.scopeService.scopeFindOneOrPublic({ where: { id } }, projectIds),
    );
  }

  async findMany(args: Prisma.RiskRulesPolicyFindManyArgs, projectIds: TProjectIds) {
    return this.prisma.riskRulesPolicy.findMany(
      this.scopeService.scopeFindManyOrPublic({ ...args }, projectIds),
    );
  }

  async update(
    id: string,
    data: Prisma.RiskRulesPolicyUncheckedUpdateInput,
    projectId: TProjectId,
  ) {
    const policy = await this.findById(id, [projectId]);
    if (policy.isPublic) {
      throw new BadRequestException('Cannot add risk rule to public policy');
    }

    return this.prisma.riskRulesPolicy.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: string, projectIds: TProjectIds) {
    return this.prisma.riskRulesPolicy.delete(
      this.scopeService.scopeDelete({ where: { id } }, projectIds),
    );
  }

  async addRiskRule(
    policyId: string,
    riskRuleId: string,
    projectIds: TProjectIds,
  ): Promise<RiskRulesPolicy> {
    const policy = await this.findById(policyId, projectIds);
    if (policy.isPublic) {
      throw new BadRequestException('Cannot add risk rule to public policy');
    }
    return this.prisma.riskRulesPolicy.update({
      where: { id: policyId },
      data: {
        riskRule: {
          connect: { id: riskRuleId },
        },
      },
    });
  }
}
