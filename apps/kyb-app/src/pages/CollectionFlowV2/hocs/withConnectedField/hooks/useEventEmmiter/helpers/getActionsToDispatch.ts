import { EngineManager } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { DocumentsRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/documents.rule-engine';
import { JmespathRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonLogicRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { Action } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export const getActionsToDispatch = (context: AnyObject, actions: Action[]) => {
  return actions.filter(action => {
    const engineManager = new EngineManager([
      new JsonLogicRuleEngine(),
      // @ts-ignore
      new JsonSchemaRuleEngine(),
      new DocumentsRuleEngine(),
      new JmespathRuleEngine(),
      // new IsStepValidRuleEngine(),
    ]);

    if (!action.dispatchOn.rules) return true;

    return (
      action.dispatchOn?.rules?.length &&
      action.dispatchOn?.rules?.every(rule =>
        engineManager
          ?.getEngine(
            // @ts-ignore
            rule?.type,
          )
          ?.test(context, rule),
      )
    );
  });
};
