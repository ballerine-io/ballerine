import { Injectable } from '@nestjs/common';
import { RiskRuleSetRepository } from './risk-rule-set.repository';

@Injectable()
export class RiskRuleSetService {
  constructor(private readonly riskRuleSetRepository: RiskRuleSetRepository) {}
}
