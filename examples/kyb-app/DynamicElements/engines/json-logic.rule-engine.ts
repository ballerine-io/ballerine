import { RuleEngine } from '@app/components/organisms/DynamicElements/engines/rule-engine.abstract';
import { IRule } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import jsonLogic from 'json-logic-js';

export class JsonLogicRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'json-logic';

  isActive(context: unknown, rule: IRule): boolean {
    const result = jsonLogic.apply(
      JSON.parse(rule.value) as AnyObject,
      context as AnyObject,
    ) as boolean;

    return result;
  }
}
