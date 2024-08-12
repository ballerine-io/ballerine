import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, RiskRule } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId, TProjectIds } from '@/types';

@Injectable()
export class RiskRuleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeService: ProjectScopeService,
  ) {}

  async create({
    createArgs,
    projectId,
  }: {
    createArgs: Omit<Prisma.RiskRuleUncheckedCreateInput, 'projectId' | 'isPublic'>;
    projectId: string;
  }) {
    return this.prisma.riskRule.create({
      data: {
        ...createArgs,
        projectId,
        isPublic: false,
      },
    });
  }

  async findById(id: string, projectIds: TProjectIds) {
    return this.prisma.riskRule.findFirstOrThrow(
      this.scopeService.scopeFindOneOrPublic(
        {
          where: { id },
        },
        projectIds,
      ),
    );
  }

  async findMany(args: Prisma.RiskRuleFindManyArgs, projectIds: TProjectIds) {
    return this.prisma.riskRule.findMany(
      this.scopeService.scopeFindManyOrPublic(
        {
          ...args,
          where: { ...args.where },
        },
        projectIds,
      ),
    );
  }

  async update(id: string, updateArgs: Prisma.RiskRuleUpdateInput, projectId: TProjectId) {
    return this.prisma.riskRule.update({
      where: { id },
      data: {
        ...updateArgs,
        projectId,
      },
    });
  }

  async delete(id: string, projectIds: TProjectIds) {
    return this.prisma.riskRule.delete(
      this.scopeService.scopeDelete(
        {
          where: { id },
        },
        projectIds,
      ),
    );
  }

  async createCopy(
    originalId: string,
    newName: string,
    projectId: string,
    projectIds: TProjectIds,
  ): Promise<RiskRule> {
    const original = await this.findById(originalId, projectIds);
    if (!original) {
      throw new Error('Original RiskRule not found');
    }

    const { id, name, createdAt, updatedAt, ...copyData } = original;

    return this.create({
      createArgs: {
        ...copyData,
        name: newName,
      },
      projectId,
    });
  }

  async connectToRuleset(riskRuleId: string, ruleSetId: string) {
    return await this.prisma.riskRuleRuleSet.create({
      data: {
        riskRule: { connect: { id: riskRuleId } },
        ruleSet: { connect: { id: ruleSetId } },
      },
    });
  }

  async disconnectFromRuleset(riskRuleId: string, ruleSetId: string) {
    return await this.prisma.riskRuleRuleSet.delete({
      where: {
        riskRuleId_ruleSetId: {
          riskRuleId,
          ruleSetId,
        },
      },
    });
  }
}
