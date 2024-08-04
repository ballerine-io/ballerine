import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectIds } from '@/types';

@Injectable()
export class RiskRulePolicyRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeService: ProjectScopeService,
  ) {}

  async createRiskRulePolicy(
    projectId: string,
    createArgs: Prisma.RiskRulesPolicyUncheckedCreateInput,
  ) {
    return this.prisma.riskRulesPolicy.create({
      data: { ...createArgs, projectId, isPublic: false },
    });
  }

  async findRiskRulePolicyById(id: string, projectIds: TProjectIds) {
    return this.prisma.riskRulesPolicy.findFirstOrThrow(
      this.scopeService.scopeFindOneOrPublic(
        {
          where: { id },
        },
        projectIds,
      ),
    );
  }

  async findRiskRulePolicyByWorkflowDefinitionId(
    workflowDefinitionId: string,
    projectIds: TProjectIds,
  ) {
    return this.prisma.riskRulesPolicy.findFirstOrThrow(
      this.scopeService.scopeFindOneOrPublic(
        {
          where: {
            workflowDefinitionRiskRulePolicies: {
              some: {
                workflowDefinitionId,
              },
            },
          },
          select: {
            riskRuleSets: true,
          },
        },
        projectIds,
      ),
    );
  }

  async findRiskRulePolicyByProjectId(projectIds: TProjectIds) {
    return this.prisma.riskRulesPolicy.findMany(
      this.scopeService.scopeFindManyOrPublic({ where: {} }, projectIds),
    );
  }
}
