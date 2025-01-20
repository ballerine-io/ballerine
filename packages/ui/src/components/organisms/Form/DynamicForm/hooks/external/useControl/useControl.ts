import { useRuleEngine } from '@/components/organisms/Form/hooks/useRuleEngine';
import { TDeepthLevelStack, useValidator } from '@/components/organisms/Form/Validator';
import { useCallback, useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useEvents } from '../../internal/useEvents';
import { useRules } from '../useRules';

export const useControl = (element: IFormElement<any, any>, stack?: TDeepthLevelStack) => {
  const { values, validationParams, metadata } = useDynamicForm();
  const { sendEvent } = useEvents(element);
  const { validate } = useValidator();
  const valuesAndMetadata = useMemo(() => ({ ...values, ...metadata }), [values, metadata]);

  const disabledRulesResult = useRuleEngine(valuesAndMetadata, {
    rules: useRules(element.disable, stack),
    runOnInitialize: true,
    executeRulesSync: true,
  });

  const isDisabled = useMemo(() => {
    if (!disabledRulesResult.length) return false;

    return disabledRulesResult.some(result => result.result === true);
  }, [disabledRulesResult]);

  const onClick = useCallback(() => {
    sendEvent('onClick');
  }, [sendEvent]);

  const onFocus = useCallback(() => {
    sendEvent('onFocus');
  }, [sendEvent]);

  const onBlur = useCallback(() => {
    sendEvent('onBlur');

    if (validationParams.validateOnBlur) {
      validate();
    }
  }, [sendEvent, validate, validationParams.validateOnBlur]);

  return {
    disabled: isDisabled,
    onClick,
    onFocus,
    onBlur,
  };
};
