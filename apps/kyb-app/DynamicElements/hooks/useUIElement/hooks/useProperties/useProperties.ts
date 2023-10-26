import { ruleEngines } from '@app/components/organisms/DynamicElements/engines';
import { EngineManager } from '@app/components/organisms/DynamicElements/helpers/engine-manager';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';
import get from 'lodash/get';
import { useDynamicUIContext } from '@app/components/organisms/DynamicElements/hooks/useDynamicUIContext';
import { UIElement } from '@app/domains/collection-flow';

export const useProperties = <TContext>(definition: UIElement<AnyObject>, context: TContext) => {
  const { errors } = useDynamicUIContext();

  const isDisabled = useMemo(() => {
    const engineManager = new EngineManager(ruleEngines);

    if (!definition.activeOn) return false;

    return !definition.activeOn?.every(rule => {
      const engine = engineManager.getEngine(rule.engine);

      return engine.isActive(context, rule);
    });
  }, [context, definition.activeOn]);

  const error = useMemo(
    () => (get(errors, definition.valueDestination) as string) || undefined,
    [definition, errors],
  );

  return {
    disabled: isDisabled,
    error,
  };
};
