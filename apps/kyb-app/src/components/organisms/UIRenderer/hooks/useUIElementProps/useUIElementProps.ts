import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useRuleExecutor } from '@/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { useUIElementState } from '@/components/organisms/UIRenderer/hooks/useUIElementState';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useUIElementProps = (definition: UIElement<AnyObject>) => {
  const { payload } = useStateManagerContext();
  const { state } = useDynamicUIContext();
  const [availabilityTestResulsts, visibilityTestResults] = [
    useRuleExecutor(
      payload,
      // @ts-ignore
      definition.availableOn,
      definition,
      state,
    ),
    useRuleExecutor(
      payload,
      // @ts-ignore
      definition.visibleOn,
      definition,
      state,
    ),
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

  if (definition.name === 'there-no-companies-with-more-than-25') {
    console.log('RULE RESULT', disabled);
  }

  return {
    disabled,
    hidden,
    errors,
  };
};
