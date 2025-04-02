import { useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { useStack } from '../../../fields';
import { IFormElement } from '../../../types';
import { checkIfRequired } from './helpers/check-if-required';

export const useRequired = (element: IFormElement, context: object) => {
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
