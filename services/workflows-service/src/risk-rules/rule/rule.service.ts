import { Injectable } from '@nestjs/common';
import { RuleRepository } from './rule.repository';

@Injectable()
export class RuleService {
  constructor(private readonly ruleRepository: RuleRepository) {}
}
