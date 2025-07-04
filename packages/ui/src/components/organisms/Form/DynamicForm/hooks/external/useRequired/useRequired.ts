import { useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { useStack } from '../../../fields';
import { checkIfRequired } from './helpers/check-if-required';
import { TUIElement } from '@ballerine/common';

export const useRequired = (element: TUIElement, context: object) => {
  const { stack } = useStack();
  const { validationParams, metadata } = useDynamicForm();

  const isRequired = useMemo(
    () =>
      checkIfRequired(
        element,
        { ...context, ...metadata },
        stack,
        validationParams.globalValidationRules,
      ),
    [element, context, stack, validationParams.globalValidationRules, metadata],
  );

  return isRequired;
};
