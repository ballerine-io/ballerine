import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useIsLoadingState } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useFieldProps/hooks/useIsLoadingState';
import { useRulesTest } from '@/pages/CollectionFlowV2/hooks/useRuleTests';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useDisabledState = (uiElement: UIElement, context: AnyObject) => {
  const { state } = useDynamicUIContext();
  const isDisabled = useMemo(
    () => Boolean(state?.elements?.[uiElement.getId()]?.isDisabled),
    [state, uiElement],
  );
  const isRevision = useMemo(() => Boolean(state?.isRevision), [state]);
  const isLoading = useIsLoadingState(uiElement);

  const isDisabledByRules = useRulesTest(
    context,
    uiElement.getDefinition()?.availableOn || [],
    'Disabled',
  );

  const disabled = useMemo(() => {
    // TODO: Get rid of this weird check after refactor.
    if (isLoading || isDisabled || isRevision) return true;

    return isDisabledByRules;
  }, [isLoading, isDisabled, isRevision]);

  return disabled;
};
