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

  test(context: unknown, rule: unknown, _: UIElement<AnyObject>, uiState: UIState): RuleTestResult {
    if (this.isJsonRule(rule)) {
      const result = jsonLogic.apply(rule.value, {
        ...(context as object),
        uiState,
      } as AnyObject) as boolean;

      return { isValid: result, errors: [] };
    }

    throw new Error(`Invalid rule provided to ${this.ENGINE_NAME}`);
  }

  private isJsonRule(rule: unknown): rule is JSONLogicRule {
    return typeof rule === 'object' && 'type' in rule && rule.type === 'json-logic';
  }
}
