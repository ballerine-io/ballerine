import { Injectable } from '@nestjs/common';
import { OperationHelpers, RuleSet } from '@ballerine/common';
import { RuleEngine } from './core/rule-engine';

@Injectable()
export class RuleEngineService {
  public run(rules: RuleSet, formData: object) {
    const ruleEngine = RuleEngine(rules, OperationHelpers);

    return ruleEngine.run(formData);
  }
}
