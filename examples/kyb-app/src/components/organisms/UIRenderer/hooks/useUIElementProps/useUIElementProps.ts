import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines';
import { JsonSchemaRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

const engines = [new JsonSchemaRuleEngine(), new JsonLogicRuleEngine()];

export const useUIElementProps = (definition: UIElement<AnyObject>) => {
  const { payload } = useStateManagerContext();

  const disabled = useMemo(() => {
    if (!definition.availableOn || !definition.availableOn.length) return false;

    const engineManager = new EngineManager(engines);

    const isAvailableByRules = definition.availableOn.map(rule => {
      const engine = engineManager.getEngine(rule.type);

      if (!engine) {
        console.log(`Engine ${rule.type} not found`);
        return true;
      }

      let {isValid} = engine.isActive(payload, rule);
      return isValid;
    });
    const isAllRulesValid = isAvailableByRules.every((isValid) => isValid)

    return isAllRulesValid;
  }, [payload, definition]);

  const hidden = useMemo(() => {
    if (!definition.visibleOn || !definition.visibleOn.length) return false;

    const engineManager = new EngineManager(engines);

    const isVisible = definition.visibleOn.every(rule => {
      const engine = engineManager.getEngine(rule.type);

      if (!engine) {
        console.log(`Engine ${rule.type} not found`);
        return true;
      }

      const {isValid} = engine.isActive(payload, rule);

      return {isValid};
    });

    return !isVisible;
  }, [payload, definition]);

  const errors = useMemo(() => {
    if (!definition.availableOn || !definition.availableOn.length || !definition.availableOn.every(rule => rule.isIncludingErrors)) return [];
    const engineManager = new EngineManager(engines);

    return definition.availableOn.map(rule => {
      const engine = engineManager.getEngine(rule.type);
      const {errors} = engine.isActive(payload, rule);

      return errors
    }).flat();
  }, [payload, definition]);

  console.log('def', definition, hidden);

  return {
    disabled,
    hidden,
    errors
  };
};
