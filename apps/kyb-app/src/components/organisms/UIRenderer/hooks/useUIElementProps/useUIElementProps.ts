import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useRuleExecutor } from '@/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { injectIndexesAtRulesPaths } from '@/components/organisms/UIRenderer/hooks/useUIElementProps/helpers';
import { useUIElementState } from '@/components/organisms/UIRenderer/hooks/useUIElementState';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useUIElementProps = (
  definition: UIElement<AnyObject>,
  index: number | null = null,
) => {
  const { payload } = useStateManagerContext();
  const { state } = useDynamicUIContext();
  const availabilityRules = useMemo(() => {
    return injectIndexesAtRulesPaths(definition.availableOn || [], index);
  }, [definition, index]);

  const visibilityRules = useMemo(() => {
    return injectIndexesAtRulesPaths(definition.visibleOn || [], index);
  }, [definition, index]);

  const [availabilityTestResults, visibilityTestResults] = [
    useRuleExecutor(
      payload,
      // @ts-ignore
      availabilityRules,
      definition,
      state,
    ),
    useRuleExecutor(
      payload,
      // @ts-ignore
      visibilityRules,
      definition,
      state,
    ),
  ];

  const { state: uiElementState } = useUIElementState(definition);
  const { isLoading, isDisabled } = uiElementState;

  const disabled = useMemo(() => {
    if (isLoading || isDisabled || state.isRevision) return true;

    return availabilityTestResults.length
      ? availabilityTestResults.some(result => !result.isValid)
      : false;
  }, [availabilityTestResults, isLoading, isDisabled, state.isRevision]);

  const hidden = useMemo(() => {
    if (!definition.visibleOn || !definition.visibleOn.length) return false;

    const isVisible = visibilityTestResults.every(result => result.isValid);

    return !isVisible;
  }, [visibilityTestResults, definition]);

  const errors = useMemo(() => {
    return [];
  }, []);

  return {
    disabled,
    hidden,
    errors,
  };
};
