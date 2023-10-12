import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import {
  RuleEngine,
  RuleTestResult,
} from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { JMESPathRule, Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import jmespath from 'jmespath';

export class JmespathRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'jmespath';

  test(
    context: unknown,
    rule: Rule,
    definition: UIElement<AnyObject>,
    uiState: UIState,
  ): RuleTestResult {
    if (this.isJmesPath(rule)) {
      const result = jmespath.search({ ...(context as AnyObject), uiState }, rule.value) as boolean;
      return {
        isValid: Boolean(result),
        errors: [],
      };
    }

    throw new Error(`Invalid rule provided to ${this.ENGINE_NAME}`);
  }

  private isJmesPath(rule: Rule): rule is JMESPathRule {
    if (rule.type === 'jmespath' && typeof rule.value === 'string') return true;

    return false;
  }
}
