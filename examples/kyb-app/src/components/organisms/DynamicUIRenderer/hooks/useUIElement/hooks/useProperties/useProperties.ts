import { ruleEngines } from '@app/components/organisms/DynamicUIRenderer/engines';
import { EngineManager } from '@app/components/organisms/DynamicUIRenderer/helpers/engine-manager';
import { UIElement } from '@app/components/organisms/DynamicUIRenderer/temp';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useProperties = <TContext>(definition: UIElement<AnyObject>, context: TContext) => {
  const isDisabled = useMemo(() => {
    const engineManager = new EngineManager(ruleEngines);

    if (!definition.activeOn) return false;

    return !definition.activeOn?.every(rule => {
      const engine = engineManager.getEngine(rule.engine);

      return engine.isActive(context, rule);
    });
  }, [context, definition.activeOn]);

  return {
    disabled: isDisabled,
  };
};
