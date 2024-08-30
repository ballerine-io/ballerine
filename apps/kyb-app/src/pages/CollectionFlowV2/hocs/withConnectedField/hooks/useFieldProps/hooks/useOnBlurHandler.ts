import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useValidator } from '@/components/providers/Validator/hooks/useValidator';
import { useTouched } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useTouched';
import { useCallback } from 'react';

export interface IOnBlurHandlerParams {
  validateOnBlur: boolean;
}

const defaultParams: IOnBlurHandlerParams = {
  validateOnBlur: true,
};

export const useOnBlurHandler = (uiElement: UIElement, params = defaultParams) => {
  const { validateOnBlur } = params;

  const { currentPage } = usePageResolverContext();
  const { touchElement } = useTouched(uiElement, currentPage!);
  const { validate } = useValidator();

  const handleBlur = useCallback(() => {
    touchElement();
    if (validateOnBlur) {
      validate();
    }
  }, [touchElement, validate]);

  return handleBlur;
};
