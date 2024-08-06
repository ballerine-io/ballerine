import { EngineManager } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { DocumentsRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/documents.rule-engine';
import { IsStepValidRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/is-step-valid.rule-engine';
import { JmespathRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonLogicRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { Action, UIElement, UIPage } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export const getDispatchableActions = (
  context: AnyObject,
  actions: Action[],
  definition: UIElement<AnyObject>,
  state: UIState,
  currentPage: UIPage,
) => {
  return actions.filter(action => {
    const engineManager = new EngineManager([
      new JsonLogicRuleEngine(),
      // @ts-ignore
      new JsonSchemaRuleEngine(),
      new DocumentsRuleEngine(),
      new JmespathRuleEngine(),
      new IsStepValidRuleEngine(),
    ]);

    if (!action.dispatchOn.rules) return true;

    return (
      action.dispatchOn?.rules?.length &&
      action.dispatchOn?.rules?.every(
        rule =>
          engineManager
            ?.getEngine(
              // @ts-ignore
              rule?.type,
            )
            ?.validate(context, rule, definition, state, currentPage).isValid,
      )
    );
  });
};
