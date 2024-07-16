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
    createArgs: Prisma.RiskRulesPolicyCreateArgs['data'],
  ) {
    return this.prisma.riskRulesPolicy.create({
      data: createArgs,
    });
  }

  async findRiskRulePolicyById(id: string, projectIds: TProjectIds) {
    return this.prisma.riskRulesPolicy.findUnique({
      where: { id },
    });
  }

  async findRiskRulePolicyByWorkflowDefinitionId(
    workflowDefinitionId: string,
    projectIds: TProjectIds,
  ) {
    return this.prisma.riskRulesPolicy.findFirstOrThrow({
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
    });
  }

  async findRiskRulePolicyByProjectId(projectId: string) {
    return this.prisma.riskRulesPolicy.findFirst({
      where: { projectId },
    });
  }
}
