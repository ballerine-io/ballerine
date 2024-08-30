import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { useOnBlurHandler } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useFieldProps/hooks/useOnBlurHandler';
import { useOnChangeHandler } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useFieldProps/hooks/useOnChangeHandler';
import { useTouched } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useTouched';
import { useIsDisabledState } from '@/pages/CollectionFlowV2/hooks/useDisabledState';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { useMemo } from 'react';

export const useFieldProps = <TValueType = unknown>(
  definition: UIElementV2,
  stack: number[],
): IFieldComponentProps<TValueType>['fieldProps'] => {
  const { payload } = useStateManagerContext();
  const { currentPage } = usePageResolverContext();
  const uiElement = useUIElement(definition, payload, stack);

  const { isTouched } = useTouched(uiElement, currentPage!);
  const onChange = useOnChangeHandler(uiElement);
  const onBlur = useOnBlurHandler(uiElement);
  const disabled = useIsDisabledState(uiElement, payload);
  const value = useMemo(() => uiElement.getValue(), [uiElement, payload]);

  return {
    isTouched,
    onChange,
    onBlur,
    disabled,
    value,
  };
};
