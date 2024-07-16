import { Injectable } from '@nestjs/common';
import { RiskRulePolicyRepository } from './risk-rule-policy.repository';

@Injectable()
export class RiskRulePolicyService {
  constructor(private readonly riskRuleSetRepository: RiskRulePolicyRepository) {}
}
