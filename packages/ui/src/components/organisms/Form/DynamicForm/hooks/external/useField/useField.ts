import { useRuleEngine } from '@/components/organisms/Form/hooks';
import { TDeepthLevelStack, useValidator } from '@/components/organisms/Form/Validator';
import { useCallback, useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useEvents } from '../../internal/useEvents';
import { usePriorityFields } from '../../internal/usePriorityFields';
import { useElementId } from '../useElementId';
import { useRules } from '../useRules';
import { useValueDestination } from '../useValueDestination';

export const useField = <TValue>(element: IFormElement<any, any>, stack?: TDeepthLevelStack) => {
  const fieldId = useElementId(element, stack);
  const valueDestination = useValueDestination(element, stack);

  const { fieldHelpers, values, validationParams, metadata } = useDynamicForm();
  const { sendEvent, sendEventAsync } = useEvents(element);
  const { validate } = useValidator();
  const { setValue, getValue, setTouched, getTouched } = fieldHelpers;

  const value = useMemo(() => getValue<TValue>(valueDestination), [valueDestination, getValue]);
  const touched = useMemo(() => getTouched(fieldId), [fieldId, getTouched]);

  const valuesAndMetadata = useMemo(() => ({ ...values, ...metadata }), [values, metadata]);

  const disabledRulesResult = useRuleEngine(valuesAndMetadata, {
    rules: useRules(element.disable, stack),
    runOnInitialize: true,
    executionDelay: 500,
  });

  const isDisabled = useMemo(() => {
    if (!disabledRulesResult.length) return false;

    return disabledRulesResult.some(result => result.result === true);
  }, [disabledRulesResult]);

  const onChange = useCallback(
    <TValue>(value: TValue, ignoreEvent = false) => {
      setValue(fieldId, valueDestination, value);
      setTouched(fieldId, true);

      if (!ignoreEvent) {
        sendEventAsync('onChange');
      }
    },
    [fieldId, valueDestination, setValue, setTouched, sendEventAsync],
  );

  const onBlur = useCallback(() => {
    sendEvent('onBlur');
    setTouched(fieldId, true);

    if (validationParams.validateOnBlur) {
      validate();
    }
  }, [sendEvent, validationParams.validateOnBlur, validate, fieldId, setTouched]);

  const onFocus = useCallback(() => {
    sendEvent('onFocus');
  }, [sendEvent]);

  return {
    value,
    touched,
    disabled: usePriorityFields(element).isShouldDisablePriorityField || isDisabled,
    onChange,
    onBlur,
    onFocus,
  };
};
