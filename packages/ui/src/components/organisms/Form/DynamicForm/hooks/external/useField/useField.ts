import { AnyObject } from '@/common';
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

export const useField = <TValue>(
  element: IFormElement<any, any>,
  stack?: TDeepthLevelStack,
  elementState?: AnyObject,
) => {
  const fieldId = useElementId(element, stack);
  const valueDestination = useValueDestination(element, stack);

  const { fieldHelpers, values, validationParams, metadata, disabled } = useDynamicForm();
  const { sendEvent, sendEventAsync } = useEvents(element);
  const { validate } = useValidator();
  const { setValue, getValue, setTouched, getTouched } = fieldHelpers;

  const value = useMemo(() => getValue<TValue>(valueDestination), [valueDestination, getValue]);
  const touched = useMemo(() => getTouched(fieldId), [fieldId, getTouched]);

  const valuesAndMetadata = useMemo(
    () => ({ ...values, ...metadata, $this: elementState }),
    [values, metadata, elementState],
  );

  const disabledRulesResult = useRuleEngine(valuesAndMetadata, {
    rules: useRules(element.disable, stack),
    runOnInitialize: true,
    executionDelay: 100,
  });

  const isDisabled = useMemo(() => {
    if (disabled) {
      return true;
    }

    if (!disabledRulesResult.length) {
      return false;
    }

    return disabledRulesResult.some(result => result.result === true);
  }, [disabledRulesResult, disabled]);

  const onChange = useCallback(
    <TValue>(value: TValue, ignoreEvent = false) => {
      const resolvedValue = value === undefined ? element.defaultValue : value;

      setValue(fieldId, valueDestination, resolvedValue);

      if (!ignoreEvent) {
        if (element?.params?.syncEvents) {
          sendEvent('onChange');
        } else {
          sendEventAsync('onChange');
        }
      }
    },
    [fieldId, valueDestination, setValue, sendEventAsync, sendEvent, element],
  );

  const onBlur = useCallback(async () => {
    sendEvent('onBlur');

    if (validationParams.validateOnBlur) {
      await validate();
    }

    await setTouched(fieldId, true);
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
