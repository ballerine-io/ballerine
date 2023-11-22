import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useRuleExecutor } from '@app/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';
import { UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useUIElementProps = (definition: UIElement<AnyObject>) => {
  const { payload } = useStateManagerContext();
  const { state } = useDynamicUIContext();
  const [availabilityTestResulsts, visibilityTestResults] = [
    useRuleExecutor(payload, definition.availableOn, definition, state),
    useRuleExecutor(payload, definition.visibleOn, definition, state),
  ];

  const { state: uiElementState } = useUIElementState(definition);
  const { isLoading, isDisabled } = uiElementState;

  const disabled = useMemo(() => {
    if (isLoading || isDisabled || state.isRevision) return true;

    return availabilityTestResulsts.length
      ? availabilityTestResulsts.some(result => !result.isValid)
      : false;
  }, [availabilityTestResulsts, isLoading, isDisabled, state.isRevision]);

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
