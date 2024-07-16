import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RiskRuleSetRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create(
    riskRulePolicyId,
    createArgs: Omit<Prisma.RiskRuleSetCreateArgs['data'], 'riskRulePolicyId'>,
  ) {
    return await this.prisma.riskRuleSet.create({
      data: { ...createArgs, riskRulePolicyId },
    });
  }

  async findMany(riskRulePolicyId: string, args: Prisma.RiskRuleSetFindManyArgs) {
    return await this.prisma.riskRuleSet.findMany({
      ...args,
      where: { ...args?.where, riskRulePolicyId },
    });
  }

  async findById(
    id: string,
    riskRulePolicyId: string,
    args?: Prisma.RiskRuleSetFindFirstOrThrowArgs,
  ) {
    return await this.prisma.riskRuleSet.findFirstOrThrow({
      ...(args ? args : {}),
      where: { ...(args?.where ? { ...args?.where } : {}), id: id, riskRulePolicyId },
    });
  }

  async updateById(
    id: string,
    riskRulePolicyId: string,
    dataArgs: Prisma.RiskRuleSetUpdateArgs['data'],
  ) {
    return this.prisma.riskRuleSet.update({
      data: dataArgs,
      where: {
        id_riskRulePolicyId: {
          id: id,
          riskRulePolicyId: riskRulePolicyId,
        },
      },
    });
  }

  async deleteById(id: string, riskRulePolicyId: string) {
    return this.prisma.riskRuleSet.delete({
      where: {
        id_riskRulePolicyId: {
          id: id,
          riskRulePolicyId: riskRulePolicyId,
        },
      },
    });
  }
}
