import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { useDisabledState } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useFieldProps/hooks/useDisabledState';
import { useOnBlurHandler } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useFieldProps/hooks/useOnBlurHandler';
import { useOnChangeHandler } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useFieldProps/hooks/useOnChangeHandler';
import { useTouched } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useTouched';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useFieldProps = <TValueType = unknown>(
  definition: UIElementV2,
  context: AnyObject,
  stack: number[],
): IFieldComponentProps<TValueType>['fieldProps'] => {
  const { currentPage } = usePageResolverContext();
  const uiElement = useUIElement(definition, context, stack);

  const { isTouched } = useTouched(uiElement, currentPage!);
  const onChange = useOnChangeHandler(uiElement);
  const onBlur = useOnBlurHandler(uiElement);
  const disabled = useDisabledState(uiElement, context);
  const value = useMemo(() => uiElement.getValue(), [uiElement, context]);

  return {
    isTouched,
    onChange,
    onBlur,
    disabled,
    value,
  };
};
