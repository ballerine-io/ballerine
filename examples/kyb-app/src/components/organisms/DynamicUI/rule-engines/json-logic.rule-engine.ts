import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import {
  RuleEngine,
  RuleTestResult,
} from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { JSONLogicRule, Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import jsonLogic from 'json-logic-js';

export class JsonLogicRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'json-logic';

  test(context: unknown, rule: Rule, _: UIElement<AnyObject>, uiState: UIState): RuleTestResult {
    if (this.isJsonRule(rule)) {
      const result = jsonLogic.apply(rule.value, {
        ...(context as object),
        uiState,
      } as AnyObject) as boolean;

      return { isValid: result, errors: [] };
    }

    throw new Error(`Invalid rule provided to ${this.ENGINE_NAME}`);
  }

  private isJsonRule(rule: Rule): rule is JSONLogicRule {
    return rule.type === 'json-logic' && typeof rule.value === 'object';
  }
}
