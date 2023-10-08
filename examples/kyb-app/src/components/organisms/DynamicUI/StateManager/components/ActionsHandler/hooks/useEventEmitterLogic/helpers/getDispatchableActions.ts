import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import { Action, Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { JsonSchemaRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';

export const getDispatchableActions = (
  context: AnyObject,
  actions: Action[],
  definition: UIElement<AnyObject>,
  state: UIState,
) => {
  return actions.filter(action => {
    const engineManager = new EngineManager([
      new JsonLogicRuleEngine(),
      new JsonSchemaRuleEngine(),
    ]);

    if (!action.dispatchOn.rules) return true;

    return (
      action.dispatchOn?.rules?.length &&
      action.dispatchOn?.rules?.some(rule =>
        engineManager.getEngine(rule.type).isActive(context, rule as Rule, definition, state),
      )
    );
  });
};
