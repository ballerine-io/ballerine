import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useEventEmmitter } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useEventEmmiter';
import { useValidateWithDebounce } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useFieldProps/hooks/useValidateWithDebounce';
import set from 'lodash/set';
import { useCallback } from 'react';

const EVENT_TYPE = 'onChange';

export interface IOnChangeHandlerParams {
  validateOnChange: boolean;
  validationDelay: number;
}

const defaultParams: IOnChangeHandlerParams = {
  validationDelay: 500,
  validateOnChange: true,
};

export const useOnChangeHandler = <TValueType>(uiElement: UIElement, params = defaultParams) => {
  const { validationDelay, validateOnChange } = params;

  const emitEvent = useEventEmmitter(uiElement);

  const { stateApi } = useStateManagerContext();
  const { setContext, getContext } = stateApi;

  const validate = useValidateWithDebounce(validationDelay);

  const onChangeHandler = useCallback(
    (value: TValueType) => {
      const context = getContext();

      // Mutating context
      set(context, uiElement.getValueDestination(), value);

      // Refreshing app state
      setContext(context);

      emitEvent(EVENT_TYPE);

      if (validateOnChange) {
        validate();
      }
    },
    [uiElement, validateOnChange, validate, getContext, setContext, emitEvent],
  );

  return onChangeHandler;
};
