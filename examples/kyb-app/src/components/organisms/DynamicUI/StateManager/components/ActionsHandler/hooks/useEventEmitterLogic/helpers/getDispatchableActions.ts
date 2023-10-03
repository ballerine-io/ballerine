import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import { Action, Rule } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export const getDispatchableActions = (context: AnyObject, actions: Action[]) => {
  return actions.filter(action => {
    const engineManager = new EngineManager([new JsonLogicRuleEngine()]);

    return (
      action.dispatchOn.rules.length &&
      action.dispatchOn.rules.every(rule =>
        engineManager.getEngine(rule.type).isActive(context, rule as Rule),
      )
    );
  });
};
