import { RuleEngine } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/rule-engines/rule-engine.abstract';
import { Rule } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import jsonLogic from 'json-logic-js';

export class JsonLogicRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'json-logic';

  isActive(context: unknown, rule: Rule): boolean {
    console.log('rule', rule);
    const result = jsonLogic.apply(rule.value, context as AnyObject) as boolean;

    return result;
  }
}
