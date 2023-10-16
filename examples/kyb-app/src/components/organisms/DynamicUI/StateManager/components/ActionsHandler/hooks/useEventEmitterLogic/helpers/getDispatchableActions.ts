import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import { Action, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { JsonSchemaRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { DestinationRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/destination.rule-engine';
import { JmespathRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';

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
      new DestinationRuleEngine(),
      new JmespathRuleEngine(),
    ]);

    if (!action.dispatchOn.rules) return true;

    console.log('rules', action.dispatchOn?.rules);

    return (
      action.dispatchOn?.rules?.length &&
      action.dispatchOn?.rules?.some(
        rule => engineManager.getEngine(rule.type).test(context, rule, definition, state).isValid,
      )
    );
  });
};
