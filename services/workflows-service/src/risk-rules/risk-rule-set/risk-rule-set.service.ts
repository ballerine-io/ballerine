import { Injectable, NotFoundException } from '@nestjs/common';
import { RiskRuleSetRepository } from './risk-rule-set.repository';
import { Static } from '@sinclair/typebox';
import { CreateRuleSetSchema } from '@/risk-rules/schemas/create-rule-set.schema';
import { CreateRiskRuleSchema } from '@/risk-rules/schemas/create-risk-rule.schema';

@Injectable()
export class RiskRuleSetService {
  constructor(private readonly riskRuleSetRepository: RiskRuleSetRepository) {}

  async create(policyId: string, createRiskRuleSetData: Static<typeof CreateRiskRuleSchema>) {
    return this.riskRuleSetRepository.create(policyId, {
      ...createRiskRuleSetData,
      rules: {
        createMany: {
          data: createRiskRuleSetData.ruleSet.rules.map(rule => ({
            operator: rule.operation,
            engine: rule.engine,
            comparisonValue: rule.value,
            key: rule.key,
          })),
        },
      },
    });
  }

  async findOne(id: string, policyId: string) {
    const riskRuleSet = await this.riskRuleSetRepository.findById(id, policyId);

    return riskRuleSet;
  }

  async update(
    id: string,
    policyId: string,
    updateRiskRuleSetDto: Static<typeof CreateRiskRuleSchema>,
  ) {
    // TODO update to risk to update module
    const updatedRiskRuleSet = await this.riskRuleSetRepository.updateById(
      id,
      policyId,
      updateRiskRuleSetDto,
    );

    if (!updatedRiskRuleSet) {
      throw new NotFoundException(`RiskRuleSet with ID "${id}" not found`);
    }

    return updatedRiskRuleSet;
  }

  async delete(id: string, policyId: string) {
    const result = await this.riskRuleSetRepository.deleteById(id, policyId);

    if (!result?.id) {
      throw new NotFoundException(`RiskRuleSet with ID "${id}" not found`);
    }
  }
}
