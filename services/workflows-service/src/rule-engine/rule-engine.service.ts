import { Injectable } from '@nestjs/common';
import { OperationHelpers, RuleSet, RuleSetWithChildren } from '@ballerine/common';
import { RuleEngine } from './core/rule-engine';

@Injectable()
export class RuleEngineService {
  public run(rules: RuleSet | RuleSetWithChildren, formData: object) {
    const ruleEngine = RuleEngine(rules, OperationHelpers);

    return ruleEngine.run(formData);
  }
}
