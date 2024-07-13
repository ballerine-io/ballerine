import { Injectable } from '@nestjs/common';
import { OperationHelpers, RuleSet, RuleEngine } from '@ballerine/common';

@Injectable()
export class RuleEngineService {
  public run(rules: RuleSet, formData: object) {
    const ruleEngine = RuleEngine(rules, OperationHelpers);

    return ruleEngine.run(formData);
  }
}
