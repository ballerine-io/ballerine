import { Injectable } from '@nestjs/common';
import { operationHelpers } from './core/operators/constants';
import { RuleEngine } from './core/rule-engine';
import { RuleSet } from '@/rule-engine/core/types';

@Injectable()
export class RuleEngineService {
  public run(rules: RuleSet, formData: object) {
    const ruleEngine = RuleEngine(rules, operationHelpers);

    const output = ruleEngine.run(formData);

    return output;
  }
}
