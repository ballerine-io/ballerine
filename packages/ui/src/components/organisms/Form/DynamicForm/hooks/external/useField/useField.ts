import { useRuleEngine } from '@/components/organisms/Form/hooks';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useCallback, useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useEvents } from '../../internal/useEvents';
import { useElementId } from '../useElementId';
import { useValueDestination } from '../useValueDestination';

export const useField = <TValue>(
  element: IFormElement<any, any>,
  stack: TDeepthLevelStack = [],
) => {
  const fieldId = useElementId(element, stack);
  const valueDestination = useValueDestination(element, stack);
  const { fieldHelpers, values } = useDynamicForm();
  const { sendEvent, sendEventAsync } = useEvents(element);
  const { setValue, getValue, setTouched, getTouched } = fieldHelpers;

  const value = useMemo(() => getValue<TValue>(valueDestination), [valueDestination, getValue]);
  const touched = useMemo(() => getTouched(fieldId), [fieldId, getTouched]);

  const disabledRulesResult = useRuleEngine(values, {
    rules: element.disable,
    runOnInitialize: true,
    executionDelay: 500,
  });

  const isDisabled = useMemo(() => {
    if (!disabledRulesResult.length) return false;

    return disabledRulesResult.every(result => result.result === true);
  }, [disabledRulesResult]);

  const onChange = useCallback(
    <TValue>(value: TValue) => {
      setValue(fieldId, valueDestination, value);
      setTouched(fieldId, true);

      sendEventAsync('onChange');
    },
    [fieldId, valueDestination, setValue, setTouched, sendEventAsync],
  );

  const onBlur = useCallback(() => {
    sendEvent('onBlur');
  }, [sendEvent]);

  const onFocus = useCallback(() => {
    sendEvent('onFocus');
  }, [sendEvent]);

  return {
    value,
    touched,
    disabled: isDisabled,
    onChange,
    onBlur,
    onFocus,
  };
};
