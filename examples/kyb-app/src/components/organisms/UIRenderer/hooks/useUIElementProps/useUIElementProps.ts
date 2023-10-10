import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines';
import { JsonSchemaRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

const engines = [new JsonSchemaRuleEngine(), new JsonLogicRuleEngine()];

export const useUIElementProps = (definition: UIElement<AnyObject>) => {
  const { payload } = useStateManagerContext();
  const { state } = useDynamicUIContext();

  const availabilityTestResults = useMemo(() => {
    const ruleEngineManager = new EngineManager(engines);

    return (
      definition.availableOn?.map(rule =>
        ruleEngineManager.getEngine(rule.type).test(payload, rule, definition, state),
      ) || []
    );
  }, [payload, definition, state]);

  const disabled = useMemo(() => {
    return availabilityTestResults.length
      ? availabilityTestResults.some(result => !result.isValid)
      : false;
  }, [availabilityTestResults]);

  const hidden = useMemo(() => {
    if (!definition.visibleOn || !definition.visibleOn.length) return false;

    const engineManager = new EngineManager(engines);

    const isVisible = definition.visibleOn.every(rule => {
      const engine = engineManager.getEngine(rule.type);

      if (!engine) {
        console.log(`Engine ${rule.type} not found`);
        return true;
      }

      const { isValid } = engine.test(payload, rule, definition, state);

      return isValid;
    });

    return !isVisible;
  }, [payload, definition, state]);

  const errors = useMemo(() => {
    if (
      !definition.availableOn ||
      !definition.availableOn.length ||
      !definition.availableOn.some(rule => rule.persistStateRule)
    )
      return [];
    const engineManager = new EngineManager(engines);

    return definition.availableOn.map(rule => {
      const engine = engineManager.getEngine(rule.type);
      const { errors } = engine.test(payload, rule, definition, state);

      return errors;
    });
  }, [payload, definition, state]);

  return {
    disabled,
    hidden,
    errors,
  };
};
