import { Injectable } from '@nestjs/common';
import { OperationHelpers, RuleSet } from '@ballerine/common';
import { createRuleEngine } from './core/rule-engine';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';

@Injectable()
export class RuleEngineService {
  public run(rules: RuleSet, formData: object) {
    const ruleEngine = createRuleEngine(rules, {
      helpers: OperationHelpers,
      unifiedApiClient: new UnifiedApiClient(),
    });

    return ruleEngine.run(formData);
  }
}
