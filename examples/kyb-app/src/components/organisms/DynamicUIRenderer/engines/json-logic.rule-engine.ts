import { RuleEngine } from '@app/components/organisms/DynamicUIRenderer/engines/rule-engine.abstract';
import { Rule } from '@app/components/organisms/DynamicUIRenderer/temp';
import { AnyObject } from '@ballerine/ui';
import jsonLogic from 'json-logic-js';

export class JsonLogicRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'json-logic';

  isActive(context: unknown, rule: Rule): boolean {
    const result = jsonLogic.apply(rule.value, context as AnyObject) as boolean;

    if (typeof result !== 'boolean') return false;

    return result;
  }
}
