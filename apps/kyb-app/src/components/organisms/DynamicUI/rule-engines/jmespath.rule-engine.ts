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

  validate(
    context: unknown,
    rule: Rule,
    _: UIElement<AnyObject>,
    uiState: UIState,
  ): RuleTestResult {
    const result = this.test({ ...(context as AnyObject), uiState }, rule);

    return {
      isValid: Boolean(result),
      errors: [],
    };
  }

  test(context: unknown, rule: Rule) {
    if (this.isJmesPath(rule)) {
      return jmespath.search(context, rule.value) as boolean;
    }

    throw new Error(`Invalid rule provided to ${this.ENGINE_NAME}`);
  }

  private isJmesPath(rule: Rule): rule is JMESPathRule {
    if (rule.type === 'jmespath' && typeof rule.value === 'string') return true;

    return false;
  }
}
