import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { RuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { IRule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import jsonLogic from 'json-logic-js';

export class JsonLogicRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'json-logic';

  test(context: unknown, rule: IRule, _: UIElement<AnyObject>, uiState: UIState) {
    const result = jsonLogic.apply(rule.value, {
      ...(context as object),
      uiState,
    } as AnyObject) as boolean;

    return { isValid: result, errors: [] };
  }
}
