import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import {
  RuleEngine,
  RuleTestResult,
} from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { JSONLogicRule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import jsonLogic from 'json-logic-js';

export class JsonLogicRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'json-logic';

  validate(
    context: unknown,
    rule: unknown,
    _: UIElement<AnyObject>,
    uiState: UIState,
  ): RuleTestResult {
    const result = this.test(
      {
        ...(context as object),
        uiState,
      } as AnyObject,
      rule,
    );

    return { isValid: result, errors: [] };
  }

  test(context: unknown, rule: unknown) {
    if (this.isJsonRule(rule)) {
      return jsonLogic.apply(rule.value, context as AnyObject) as boolean;
    }

    throw new Error(`Invalid rule provided to ${this.ENGINE_NAME}`);
  }

  private isJsonRule(rule: unknown): rule is JSONLogicRule {
    return typeof rule === 'object' && 'type' in rule && rule.type === 'json-logic';
  }
}
